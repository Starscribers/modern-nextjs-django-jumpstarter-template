from core.choices import TriplexTextChoices


class UsageStatus(TriplexTextChoices):
    """
    Enum for usage types.
    """

    IN_USE = "in_use", "使用中"
    AVAILABLE = "available", "可使用"
