from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import generics
from rest_framework.generics import ListCreateAPIView
from django.shortcuts import get_object_or_404

from .serializers import UserProfileSerializer, UserAnalysisSerializer,  ChatLogSerializer, MessageSerializer, UserSerializer, CallRecordSerializer, CounselingAnalysisSerializer, PhoneSerializer, OTPVerificationSerializer, BreathingSessionSerializer, SleepEntrySerializer, MoodEntrySerializer, DiarySerializer
from .models import ChatLog, Message, CounselingAnalysis, UserAnalysis, BreathingSession, SleepEntry, MoodEntry, Diary, UserProfile, CallRecord
from django.contrib.auth.models import User

from .chat.Prompt import generate_chat_response
from .analysis.predict import get_analysis
# from .sentiment.Analyze import sentiment_analysis
from django.conf import settings

from django.contrib.auth import get_user_model
from rest_framework.permissions import BasePermission, AllowAny
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import action

from rest_framework import generics
import requests
import logging

class CallRecordViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing call records.
    """
    serializer_class = CallRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        This view returns call records filtered by user_id query parameter if provided,
        otherwise returns records for the currently authenticated user.
        """
        user_id = self.request.query_params.get('user_id')
        
        if user_id:
            try:
                user_id = int(user_id)
                return CallRecord.objects.filter(user_id=user_id).order_by('-date', '-time')
            except ValueError:
                # Handle invalid user_id parameter
                return CallRecord.objects.none()
        else:
            # Default to current authenticated user
            user = self.request.user
            return CallRecord.objects.filter(user=user).order_by('-date', '-time')
    
    def perform_create(self, serializer):
        """
        When creating a call record, use the user ID from the request body.
        """
        user_id = self.request.data.get('user')
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        try:
            user = User.objects.get(id=user_id)
            serializer.save(user=user)
        except User.DoesNotExist:
            from rest_framework.exceptions import NotFound
            raise NotFound(f"User with id {user_id} does not exist")
    
    @action(detail=False, methods=['get'])
    def high_risk(self):
        """
        Return all high-risk call records for the current user.
        """
        high_risk_records = self.get_queryset().filter(risk_level='high')
        serializer = CallRecordSerializer(high_risk_records, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def needs_follow_up(self):
        """
        Return all call records that need follow-up.
        """
        follow_up_records = self.get_queryset().filter(follow_up_needed=True)
        serializer = CallRecordSerializer(follow_up_records, many=True)
        return Response(serializer.data)

class DiaryListCreateView(generics.ListCreateAPIView):
    serializer_class = DiarySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Diary.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        print(self.request.user)
        serializer.save(user=self.request.user.id)

class DiaryDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = DiarySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Diary.objects.filter(user=self.request.user)
    
class MoodEntryByUserView(APIView):
    """
    API view to retrieve all mood entries for a specific user by user ID
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id):
        # Check if the requested user_id matches the authenticated user or if user is staff
        if str(request.user.id) != user_id and not request.user.is_staff:
            return Response(
                {"error": "You don't have permission to access this user's mood data"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get the user or return 404 if not found
        user = get_object_or_404(User, id=user_id)
        
        # Get all mood entries for the user, ordered by timestamp (most recent first)
        mood_entries = MoodEntry.objects.filter(user=user).order_by('-timestamp')
        
        # Serialize the data
        serializer = MoodEntrySerializer(mood_entries, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)


class BreathingSessionByUserView(APIView):
    """
    API view to retrieve all breathing sessions for a specific user by user ID
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id):
        # Check if the requested user_id matches the authenticated user or if user is staff
        if str(request.user.id) != user_id and not request.user.is_staff:
            return Response(
                {"error": "You don't have permission to access this user's breathing session data"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get the user or return 404 if not found
        user = get_object_or_404(User, id=user_id)
        
        # Get all breathing sessions for the user, ordered by timestamp (most recent first)
        breathing_sessions = BreathingSession.objects.filter(user=user).order_by('-timestamp')
        
        # Serialize the data
        serializer = BreathingSessionSerializer(breathing_sessions, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)


class MoodEntryListCreateView(generics.ListCreateAPIView):
    serializer_class = MoodEntrySerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = MoodEntry.objects.none()  # Avoid issues before get_queryset runs

    def get_queryset(self):
        return MoodEntry.objects.filter(user=self.request.user).order_by('-timestamp')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Ensure user is assigned to the mood entry
        serializer.save(user=self.request.user)

class SleepEntryListCreate(generics.ListCreateAPIView):
    serializer_class = SleepEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SleepEntry.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        print("Authenticated User ID:", self.request.user.id)
        print("Requested User ID:", self.kwargs.get("user_id"))  # Debugging Line
        serializer.save(user=self.request.user)

class AllSleepEntriesViewSet(viewsets.ReadOnlyModelViewSet):  # Read-only for all users
    queryset = SleepEntry.objects.all().order_by('-date')
    serializer_class = SleepEntrySerializer
    permission_classes = [permissions.IsAuthenticated]  # Only authenticated users can access

class SleepEntryDelete(generics.DestroyAPIView):
    serializer_class = SleepEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SleepEntry.objects.filter(user=self.request.user)

# ✅ Breathing Session API
class BreathingSessionView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is logged in

    def get(self, request):
        """Retrieve all breathing sessions for the logged-in user"""
        sessions = BreathingSession.objects.filter(user=request.user).order_by('-timestamp')
        serializer = BreathingSessionSerializer(sessions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Create a new breathing session"""
        serializer = BreathingSessionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # Assign the logged-in user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

import random
import requests

class SendOTPView(APIView):
    authentication_classes = []  # Disable authentication
    permission_classes = [AllowAny]

    def post(self, request):
        # Extract phone from request data directly
        # If you still want to use serializer, uncomment the serializer lines
        
        # serializer = PhoneSerializer(data=request.data)
        # if not serializer.is_valid():
        #     return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        # phone_number = serializer.validated_data['phone']
        
        phone_number = request.data.get("phone")
        
        if not phone_number:
            return Response(
                {"success": False, "error": "Phone number is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate a random 6-digit OTP
        otp_code = str(random.randint(100000, 999999))
        
        logger.info(f"Generated OTP for {phone_number}: {otp_code}")
        
        # Save the OTP in Django cache
        cache.set(f"otp_{phone_number}", otp_code, timeout=300)  # OTP expires in 5 minutes

        api_url = "https://api.textlocal.in/send/"
        api_key = "NjU0ZTZkNjg2ZDQxNzA2YzU3MzM0MjczNzU2OTU2NTQ="  # 🔹 Replace with your TextLocal API key

        payload = {
            "apikey": api_key,
            "numbers": phone_number,
            "message": f"Your OTP is {otp_code}",  # 🔹 Customize the message
            "sender": "TXTLCL",  # 🔹 Use an approved sender ID
        }

        response11 = requests.post(api_url, data=payload)
        print(response11.json())  # ✅ Returns response from TextLocal

        # In a production environment, you would send this OTP via SMS
        # Instead of using Twilio, you could:
        # 1. Use a different SMS provider
        # 2. Implement email delivery instead
        # 3. For testing, simply return the OTP in the response

        return Response({
            "success": True,
            "message": f"OTP generated for {phone_number}",
            "otp": otp_code  # Include OTP in response for testing purposes only
        }, status=status.HTTP_200_OK)

import logging
from twilio.base.exceptions import TwilioRestException

logger = logging.getLogger(__name__)

from django.core.cache import cache

class SleepEntryByUserView(APIView):
    """
    API view to retrieve all sleep entries for a specific user by user ID
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id):
        # Check if the requested user_id matches the authenticated user or if user is staff
        if str(request.user.id) != user_id and not request.user.is_staff:
            return Response(
                {"error": "You don't have permission to access this user's sleep data"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get the user or return 404 if not found
        user = get_object_or_404(User, id=user_id)
        
        # Get all sleep entries for the user, ordered by date (most recent first)
        sleep_entries = SleepEntry.objects.filter(user=user).order_by('-date')
        
        # Serialize the data
        serializer = SleepEntrySerializer(sleep_entries, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)

class IsPhoneVerified(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_phone_verified

User = get_user_model()

class VerifyOTPView(APIView):
    authentication_classes = []  # Disable authentication
    permission_classes = [AllowAny]

    def post(self, request):
        phone_number = request.data.get("phone")
        otp_code = request.data.get("otp")
        
        if not phone_number or not otp_code:
            return Response(
                {"success": False, "error": "Phone number and OTP are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        otp_code = str(otp_code).strip()
        
        logger.info(f"Verifying OTP {otp_code} for {phone_number}")
        
        stored_otp = cache.get(f"otp_{phone_number}")
        logger.info(f"Stored OTP for {phone_number}: {stored_otp}")
        
        if stored_otp and str(stored_otp).strip() == otp_code:
            cache.delete(f"otp_{phone_number}")
            
            logger.info(f"OTP verified successfully for {phone_number}")
            
            try:
                profile = UserProfile.objects.filter(phone_number=phone_number).first()
                
                if profile:
                    logger.info(f"Found UserProfile for phone: {phone_number}")
                    
                    profile.is_phone_verified = True
                    profile.save()
                    
                    logger.info(f"Set is_phone_verified=True for user: {profile.user.username}")
                    
                    return Response({
                        "success": True, 
                        "message": "Phone verified successfully",
                        "user_id": profile.user.id,
                        "username": profile.user.username
                    }, status=status.HTTP_200_OK)
                else:
                    logger.warning(f"No UserProfile found with phone_number={phone_number}")
            except Exception as e:
                logger.error(f"Error updating profile: {str(e)}")
            
            return Response({
                "success": True,
                "message": "OTP verified successfully"
            }, status=status.HTTP_200_OK)
        
        if stored_otp:
            logger.info(f"OTP comparison failed: '{stored_otp}' vs '{otp_code}'")
        else:
            logger.info(f"No OTP found in cache for {phone_number}")
        
        return Response({
            "success": False, 
            "error": "Invalid or expired OTP"
        }, status=status.HTTP_400_BAD_REQUEST)

class AllUsersWithProfileView(APIView):
    """
    API view to retrieve all users with their profile information
    """
    permission_classes = [permissions.IsAuthenticated]  # Ensure only authenticated users can access

    def get(self, request):
        # Check if user is staff for authorization
        if not request.user.is_staff:
            return Response(
                {"error": "You don't have permission to access all users data"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get all users
        users = User.objects.all()
        
        # Create a list to hold the combined user and profile data
        user_profile_data = []
        
        for user in users:
            # Get user data using UserSerializer
            user_serializer = UserSerializer(user, context={'request': request})
            user_data = user_serializer.data
            
            # Try to get profile data
            try:
                profile = UserProfile.objects.get(user=user)
                profile_serializer = UserProfileSerializer(profile, context={'request': request})
                profile_data = profile_serializer.data
            except UserProfile.DoesNotExist:
                # If user has no profile, set default values
                profile_data = {"age": None, "gender": None, "location": None, "phone_number": None, "is_phone_verified": False}
            
            # Combine user data with profile data
            combined_data = {
                **user_data,  # Include all user data
                **profile_data  # Include all profile data
            }
            
            user_profile_data.append(combined_data)
        
        return Response(user_profile_data, status=status.HTTP_200_OK)
# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]  
        return [permissions.IsAuthenticated()]  

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Create User (handled in serializer.save())
        user = serializer.save()
        
        # Get phone directly from request.data and update the UserProfile
        print("Request Data:", request.data)  # Debugging Line
        phone = request.data.get('phone', '')
        print(phone)
        if phone:
            # Get or create UserProfile
            profile, created = UserProfile.objects.get_or_create(user=user)
            profile.phone_number = phone
            profile.is_phone_verified = True
            profile.save()
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        user.delete()
        return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

class ChatLogViewSet(viewsets.ModelViewSet):
    queryset = ChatLog.objects.all()
    serializer_class = ChatLogSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Extract chats data from the request
        chats_data = request.data.get('chats')
        
        # If no chats data, return an error
        if not chats_data:
            return Response(
                {"error": "No chats data provided"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Send the chats data to the webhook
            response = requests.post(
                "https://hook.us2.make.com/ugzehb1tisa8cethbq15mga1gn3k2yui",
                json={"chats": chats_data},  # Package chats in a proper JSON structure
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                # Process the response from the webhook
                external_service_response = response.json()
                
                # Update the ChatLog instance
                instance.summary = external_service_response.get('summary')
                instance.analysis = external_service_response.get('analysis')
                instance.save()
                
                serializer = self.get_serializer(instance)
                return Response(serializer.data)
            else:
                return Response(
                    {"error": f"External service returned error: {response.status_code}", "details": response.text},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        except Exception as e:
            return Response(
                {"error": f"Failed to process request: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ChatViewSet(viewsets.ModelViewSet):
    queryset = ChatLog.objects.all()
    serializer_class = ChatLogSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return ChatLog.objects.filter(user=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        return super().destroy(request, *args, **kwargs)

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):

        
        # Set up logging
        logger = logging.getLogger(__name__)
        
        logger.info("Create method called")
        print("Create method called")
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        original_message = serializer.save(from_user=True)
        
        # Get the message content
        user_message = original_message.message_content
        logger.info(f"User message: {user_message}")
        print(f"User message: {user_message}")
        
        # Get the current user if possible
        user = request.user.username if request.user.is_authenticated else "Anonymous"
        logger.info(f"User: {user}")
        print(f"User: {user}")
        
        # Prepare payload for webhook
        payload = {
            "message": user_message,
            "user": user
        }
        
        # Make POST request to webhook
        webhook_url = "https://hook.us2.make.com/6b3046q7repppwkj41i2vrl8btm6hoct"
        logger.info(f"Sending request to webhook: {webhook_url}")
        print(f"Sending request to webhook: {webhook_url}")
        
        response = requests.post(webhook_url, json=payload)
        
        # Log response details
        logger.info(f"Webhook response status: {response.status_code}")
        print(f"Webhook response status: {response.status_code}")
        logger.info(f"Webhook response content: {response.text}")
        print(f"Webhook response content: {response.text}")
        
        # Get the response from the webhook
        if response.status_code == 200:
            try:
                # Check if response is JSON
                try:
                    json_response = response.json()
                    logger.info(f"JSON response: {json_response}")
                    print(f"JSON response: {json_response}")
                    if "response" in json_response:
                        bot_response = json_response["response"]
                    else:
                        bot_response = str(json_response)
                except:
                    bot_response = response.text
            except Exception as e:
                logger.error(f"Error processing response: {str(e)}")
                print(f"Error processing response: {str(e)}")
                bot_response = "Sorry, I couldn't process your request."
        else:
            bot_response = f"Error: Received status code {response.status_code} from webhook."
        
        logger.info(f"Bot response to be saved: {bot_response}")
        print(f"Bot response to be saved: {bot_response}")
        
        # Create bot message with the response
        bot_message = Message.objects.create(
            chat=original_message.chat,
            message_content=bot_response,
            from_user=False
        )
        
        bot_serializer = self.get_serializer(bot_message)
        logger.info("Response created successfully")
        print("Response created successfully")
        
        return Response(bot_serializer.data, status=status.HTTP_201_CREATED)
    
    def get_queryset(self):
        chat_id = self.request.query_params.get('chat_id')
        if chat_id:
            return Message.objects.filter(chat_id=chat_id)
        return Message.objects.none()
    
class AnalysisQuizView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        analyses = UserAnalysis.objects.all()  # Fetch all user analyses
        serializer = UserAnalysisSerializer(analyses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        print(request.user)

        if not request.user or request.user.is_anonymous:
            return Response({"error": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

        data = request.data.copy()
        data["user"] = request.user.id  # Assign user ID

        serializer = UserAnalysisSerializer(data=data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = User.objects.select_related("userprofile").get(id=request.user.id)
        
        # First get the user data using UserSerializer
        user_serializer = UserSerializer(user, context={'request': request})
        user_data = user_serializer.data
        
        # Get the profile data using UserProfileSerializer
        try:
            profile = UserProfile.objects.get(user=user)
            profile_serializer = UserProfileSerializer(profile, context={'request': request})
            profile_data = profile_serializer.data
        except UserProfile.DoesNotExist:
            profile_data = {"age": None, "gender": None, "location": None}
        
        # Combine both data sets
        response_data = {
            **user_data,  # Include all user data
            **profile_data  # Include all profile data
        }
        
        print(response_data)
        return Response(response_data, status=status.HTTP_200_OK)


    def put(self, request):
        """ Update user profile """
        user = request.user
        print(request.data)
        # Get or create the user profile
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        # Update profile fields directly from request data
        if 'age' in request.data:
            profile.age = request.data.get('age')
        
        if 'gender' in request.data:
            profile.gender = request.data.get('gender')
        
        if 'location' in request.data:
            profile.location = request.data.get('location')
        
        # Save the updated profile
        profile.save()
        
        # Use the serializer to return the updated data
        serializer = UserProfileSerializer(profile, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)





class AnalysisView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        data = request.data.get('quiz_result', [])
        counseling_result = get_analysis(data)
        return Response({'analysis_result': counseling_result}, status=status.HTTP_200_OK)
    
@api_view(['GET'])
def get_analysis_result(request, user_id):
    permission_classes = [AllowAny]
    try:
        user = User.objects.get(id=user_id)
        analysis = CounselingAnalysis.objects.filter(user=user).order_by('-created_at').first()

        if not analysis:
            return Response({"message": "No analysis result found for this user."}, status=status.HTTP_404_NOT_FOUND)

        serializer = CounselingAnalysisSerializer(analysis)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
def save_analysis_result(request):
    authentication_classes = []
    permission_classes = [AllowAny]
    print(request.data)
    user_id = request.data.get("user")  # Ensure the request contains user_id
    sampledata = request.data.get("sampledata", [])
    analysis_result = {item["title"]: item["percentage"] for item in sampledata}


    if not user_id or not analysis_result:
        return Response({"error": "User ID and analysis result are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    # Create the CounselingAnalysis instance
    data = {
        "user": user.id,
        "career_counseling": analysis_result.get("Career Counseling", 0),
        "social_support_counseling": analysis_result.get("Social Support Counseling", 0),
        "general_counseling": analysis_result.get("General Counseling", 0),
        "bullying_intervention_counseling": analysis_result.get("Bullying Intervention Counseling", 0),
        "extracurricular_engagement_counseling": analysis_result.get("Extracurricular Engagement Counseling", 0),
        "health_and_wellness_counseling": analysis_result.get("Health and Wellness Counseling", 0),
        "school_counseling": analysis_result.get("School Counseling", 0),
        "academic_achievement_counseling": analysis_result.get("Academic Achievement Counseling", 0),
    }

    serializer = CounselingAnalysisSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Analysis result saved successfully!"}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class SentimentAnalysis(APIView):
#     def post(self, request):
#         data = request.data.get('text_input', '')
#         analysis_result = sentiment_analysis(data)
#         return Response({'analysis_result': analysis_result}, status=status.HTTP_200_OK)

class AllChatLogsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response(
                {"error": "You don't have permission to access all chat logs data"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        chatlogs = ChatLog.objects.all().order_by('-date_created')
        serializer = ChatLogSerializer(chatlogs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AllMessagesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response(
                {"error": "You don't have permission to access all messages data"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        messages = Message.objects.all().order_by('-timestamp')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AllCounselingAnalysesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response(
                {"error": "You don't have permission to access all counseling analyses data"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        analyses = CounselingAnalysis.objects.all().order_by('-created_at')
        serializer = CounselingAnalysisSerializer(analyses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AllUserAnalysesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response(
                {"error": "You don't have permission to access all user analyses data"}, 
                status=status.HTTP_403_FORBIDDEN
            )
                
        analyses = UserAnalysis.objects.all().order_by('-timestamp')
        serializer = UserAnalysisSerializer(analyses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AllBreathingSessionsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response(
                {"error": "You don't have permission to access all breathing sessions data"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        sessions = BreathingSession.objects.all().order_by('-timestamp')
        serializer = BreathingSessionSerializer(sessions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AllSleepEntriesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response(
                {"error": "You don't have permission to access all sleep entries data"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        entries = SleepEntry.objects.all().order_by('-date')
        serializer = SleepEntrySerializer(entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AllMoodEntriesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response(
                {"error": "You don't have permission to access all mood entries data"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        entries = MoodEntry.objects.all().order_by('-timestamp')
        serializer = MoodEntrySerializer(entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AllDiariesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response(
                {"error": "You don't have permission to access all diaries data"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        diaries = Diary.objects.all().order_by('-created_at')
        serializer = DiarySerializer(diaries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AllUserProfilesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response(
                {"error": "You don't have permission to access all user profiles data"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        profiles = UserProfile.objects.all()
        serializer = UserProfileSerializer(profiles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)