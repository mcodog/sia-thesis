from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from .serializers import ChatLogSerializer, MessageSerializer, UserSerializer
from .models import ChatLog, Message
from django.contrib.auth.models import User

from .chat.Prompt import generate_chat_response
from .analysis.predict import get_analysis
# from .sentiment.Analyze import sentiment_analysis

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]  
        return [permissions.IsAuthenticated()]  

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        user.delete()
        return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

class ChatViewSet(viewsets.ModelViewSet):
    queryset = ChatLog.objects.all()
    serializer_class = ChatLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChatLog.objects.filter(user=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        return super().destroy(request, *args, **kwargs)

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

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

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
        }
        return Response(user_data, status=status.HTTP_200_OK)

class AnalysisView(APIView):
    def post(self, request):
        data = request.data.get('quiz_result', [])
        counseling_result = get_analysis(data)
        return Response({'analysis_result': counseling_result}, status=status.HTTP_200_OK)

# class SentimentAnalysis(APIView):
#     def post(self, request):
#         data = request.data.get('text_input', '')
#         analysis_result = sentiment_analysis(data)
#         return Response({'analysis_result': analysis_result}, status=status.HTTP_200_OK)