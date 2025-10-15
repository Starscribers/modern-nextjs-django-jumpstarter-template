import re
from typing import Any

parameter_regex = r"\$\{\{(\w+)\}\}"


def find_parameters(text: str, pattern: str = parameter_regex) -> list[str]:
    r"""find the paramters in the text, with format of paramter_regex

    by default, the pattern is r'\$\{\{(\w+)\}\}', representing format of ${{parameter}}
    """
    return re.findall(pattern, text)


def replace_parameters(
    text: str,
    parameters_to_value: dict[str, Any],
    pattern: str = parameter_regex,
) -> str:
    r"""replace the parameters in the text with the values in the parameters

    by default, the pattern is r'\$\{\{(\w+)\}\}', representing format of ${{parameter}}
    """

    def replacer(match: re.Match[str]) -> str:
        key = match.group(1)  # The captured group, i.e., the placeholder name
        return str(
            parameters_to_value.get(
                key,
                match.group(0),
            ),
        )  # Replace with value or keep original placeholder

    return re.sub(pattern, replacer, text)
