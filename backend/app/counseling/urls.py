# basic URL Configurations
from django.urls import include, path
# import routers
from rest_framework import routers

# import everything from views
from .views import AnalysisQuizView, ChatViewSet, MessageViewSet, UserViewSet, UserProfileView, AnalysisView, save_analysis_result,get_analysis_result, SendOTPView, VerifyOTPView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

# define the router
router = routers.DefaultRouter()

# define the router path and viewset to be used
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
	# path('api/sentiment/', SentimentAnalysis.as_view(), name='sentiment_analysis'),
    path('', include(router.urls)),
	path('api-auth/', include('rest_framework.urls'))
]
