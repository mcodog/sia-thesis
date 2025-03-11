# basic URL Configurations
from django.urls import include, path
# import routers
from rest_framework import routers

from .views import (
    AnalysisQuizView, ChatViewSet, MessageViewSet, UserViewSet, UserProfileView,
    AnalysisView, save_analysis_result, get_analysis_result,
    SendOTPView, VerifyOTPView, BreathingSessionView, SleepEntryListCreate, SleepEntryDelete,
    MoodEntryListCreateView, DiaryListCreateView, DiaryDetailView

)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


# define the router
router = routers.DefaultRouter()
router.register(r'Chat', ChatViewSet)
router.register(r'Message', MessageViewSet)
router.register(r'User', UserViewSet)

# specify URL Path for rest_framework
urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), 
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/user/profile/', UserProfileView.as_view(), name='user_profile'),
    path('api/analysis/', AnalysisView.as_view(), name='quiz_analysis'),
    path('api/save-analysis/', save_analysis_result, name='save-analysis'),
    path('analysis/', AnalysisQuizView.as_view(), name='analysis'),
    path('get-analysis/<int:user_id>/', get_analysis_result, name='get-analysis'),
    path('send-otp/', SendOTPView.as_view(), name='send_otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    

    path('diary/', DiaryListCreateView.as_view(), name='diary-list-create'),
    path('diary/<int:pk>/', DiaryDetailView.as_view(), name='diary-detail'),
    path('mood-tracker/', MoodEntryListCreateView.as_view(), name='mood-tracker'),
    path('api/breathing-sessions/', BreathingSessionView.as_view(), name='breathing_sessions'),
    path('sleep-tracker/', SleepEntryListCreate.as_view(), name='sleep-list-create'),
    path('sleep-tracker/<int:pk>/', SleepEntryDelete.as_view(), name='sleep-delete'),
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]
