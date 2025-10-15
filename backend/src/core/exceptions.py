from __future__ import annotations

from typing import TYPE_CHECKING

from .definitions import ErrorCode, ErrorDict

if TYPE_CHECKING:
    pass


class ErrorCodeBoundError(Exception):
    error_code: ErrorDict | dict[str, str]


class CaptchaExpiredError(ErrorCodeBoundError):
    """Captcha expired."""

    error_code = ErrorCode.CAPTCHA_EXPIRED


class InvalidCaptchaError(ErrorCodeBoundError):
    """Invalid captcha."""

    error_code = ErrorCode.CAPTCHA_INVALID


class InvalidParameterError(ErrorCodeBoundError):
    error_code = ErrorCode.INVALID_PARAMETER


class DuplicateNameInDepartmentError(ErrorCodeBoundError):
    """Raised when a name already exists in the department."""

    error_code = ErrorCode.CONTENT_NAME_ALREADY_EXISTS_IN_DEPARTMENT


class SubmitCheckFailedError(ErrorCodeBoundError):
    """Submit check failed."""

    error_code = ErrorCode.SUBMIT_CHECK_FAILED


class ExceededMaximumRetryAttemptsError(ErrorCodeBoundError):
    """Exceeded maximum retry attempts."""

    error_code = ErrorCode.EXCEEDED_MAXIMUM_RETRY_ATTEMPTS


class CampaignAssociatedWithUserError(ErrorCodeBoundError):
    """Campaign associated with user."""

    error_code = ErrorCode.CAMPAIGN_ASSOCIATED_WITH_USER
