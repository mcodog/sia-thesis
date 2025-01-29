from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class ChatLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    date_created = models.DateField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"ChatLog {self.user} - {self.date_created}"
    
class Message(models.Model):
    chat = models.ForeignKey(ChatLog, on_delete=models.CASCADE, default=1)
    from_user = models.BooleanField(default=True)
    message_content = models.CharField(max_length=256)
    date_created = models.DateField(auto_now_add=True)
    def __str__(self):
        return self.message_content