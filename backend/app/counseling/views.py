from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import generics
from rest_framework.generics import ListCreateAPIView

from .serializers import UserAnalysisSerializer,  ChatLogSerializer, MessageSerializer, UserSerializer, CounselingAnalysisSerializer, PhoneSerializer, OTPVerificationSerializer, BreathingSessionSerializer, SleepEntrySerializer, MoodEntrySerializer, DiarySerializer
from .models import ChatLog, Message, CounselingAnalysis, UserAnalysis, BreathingSession, SleepEntry, MoodEntry, Diary
from django.contrib.auth.models import User

from .chat.Prompt import generate_chat_response
from .analysis.predict import get_analysis
# from .sentiment.Analyze import sentiment_analysis
from django.conf import settings

from django.contrib.auth import get_user_model
from rest_framework.permissions import BasePermission, AllowAny
from twilio.rest import Client
from rest_framework.authentication import SessionAuthentication, BasicAuthentication

client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

from rest_framework import generics

class DiaryListCreateView(generics.ListCreateAPIView):
    serializer_class = DiarySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Diary.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DiaryDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = DiarySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Diary.objects.filter(user=self.request.user)


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
        print("Request Data:", self.request.data)  # Debugging Line
        print("Authenticated User:", self.request.user)  # Debugging Line
        serializer.save(user=self.request.user)

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

# 1️⃣ Send OTP to User
class SendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PhoneSerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone']
            verification = client.verify.services(settings.TWILIO_VERIFY_SERVICE_SID) \
                .verifications.create(to=phone_number, channel="sms")
            return Response({"message": "OTP sent", "status": verification.status}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

import logging
from twilio.base.exceptions import TwilioRestException

logger = logging.getLogger(__name__)

class VerifyOTPView(APIView):
    authentication_classes = []  # Disable authentication
    permission_classes = [AllowAny]  # Allow anyone to verify OTP

    def post(self, request):
        serializer = OTPVerificationSerializer(data=request.data)
        
        if serializer.is_valid():
            phone_number = serializer.validated_data["phone"]
            otp_code = serializer.validated_data["otp"]

            # Initialize Twilio client
            client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

            try:
                logger.info(f"Verifying OTP for {phone_number} with Twilio...")

                # Verify the OTP
                verification_check = client.verify \
                    .services(settings.TWILIO_VERIFY_SERVICE_SID) \
                    .verification_checks.create(to=phone_number, code=otp_code)

                logger.info(f"Verification status: {verification_check.status}")

                if verification_check.status == "approved":
                    user = User.objects.filter(phone_number=phone_number).first()
                    
                    if user:
                        user.is_phone_verified = True
                        user.save()
                        return Response({"message": "Phone verified and bound to user"}, status=status.HTTP_200_OK)
                    else:
                        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

                return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

            except TwilioRestException as e:
                logger.error(f"Twilio Error: {e}")
                return Response({"error": "OTP verification failed", "details": str(e)}, status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class IsPhoneVerified(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_phone_verified

User = get_user_model()

class VerifyOTPView(APIView):

    def post(self, request):
        serializer = OTPVerificationSerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone']
            otp_code = serializer.validated_data['otp']
            verification_check = client.verify.services(settings.TWILIO_VERIFY_SERVICE_SID) \
                .verification_checks.create(to=phone_number, code=otp_code)

            if verification_check.status == "approved":
                user = request.user  # Get the logged-in user
                user.phone_number = phone_number
                user.is_phone_verified = True
                user.save()

                return Response({"message": "Phone verified and bound to user"}, status=status.HTTP_200_OK)

            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
        
        if serializer.is_valid():
            password = serializer.validated_data.pop("password")
            is_staff = serializer.validated_data.pop("is_staff", False)  # Default to False

            user = serializer.Meta.model(**serializer.validated_data, is_staff=is_staff)
            user.set_password(password)
            user.save()

            # Serialize the newly created user instance
            response_serializer = self.get_serializer(user)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    
    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        user.delete()
        return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

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
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        original_message = serializer.save(from_user=True)

        bot_response = generate_chat_response(original_message.message_content)

        bot_message = Message.objects.create(
            chat=original_message.chat,
            message_content=bot_response,
            from_user=False
        )

        bot_serializer = self.get_serializer(bot_message)
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
    permission_classes = [AllowAny]

    def get(self, request):
        user = request.user
        
        if not user or not user.is_authenticated:
            return Response({"error": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

        user_data = {
            "id": user.id,
            "username": user.username or "",
            "email": user.email or "",
            "first_name": user.first_name or "",
            "last_name": user.last_name or "",
            "isAdmin": user.is_staff or False
        }
        return Response(user_data, status=status.HTTP_200_OK)

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
    permission_classes = [AllowAny]
    user_id = request.data.get("user_id")  # Ensure the request contains user_id
    analysis_result = request.data.get("analysis_result", {})

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