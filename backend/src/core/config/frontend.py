from pydantic_settings import BaseSettings


class FrontendRedirectSettings(BaseSettings):
    FRONTEND_URL: str = "http://localhost:5173"
    DATAHUB_DOWNLOAD_LINK: str = "/notification-center/download"
    DATAHUB_UPLOAD_LINK: str = "/upload"
    USER_DETAIL_URL: str = "/account-manage/user-management/accounts/{user_uuid}/view"
    AUDIENCE_DETAIL_URL: str = "/audiences/{audience_uuid}/detail-conditions"
    TAG_ASSIGNER_DETAIL_URL: str = "/audiences/tag-attacher-management/tagging/{tag_assigner_uuid}/detail-conditions"
    CAMPAIGN_DETAIL_URL: str = "/marketing/campaigns/{campaign_uuid}"
    JOURNEY_DETAIL_URL: str = "/automated-marketing/journeys/{journey_uuid}"
    EMAIL_NOTIFICATION_REDIRECT: str = "/redirect/{notification_uuid}"
