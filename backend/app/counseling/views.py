from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .serializers import ChatLogSerializer, MessageSerializer, UserSerializer
from .models import ChatLog, Message
from django.contrib.auth.models import User

from .chat.Prompt import generate_chat_response

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ChatViewSet(viewsets.ModelViewSet):
    queryset = ChatLog.objects.all()
    serializer_class = ChatLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChatLog.objects.filter(user=self.request.user)

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

