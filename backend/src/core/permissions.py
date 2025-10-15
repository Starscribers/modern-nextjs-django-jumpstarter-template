from __future__ import annotations

from typing import TYPE_CHECKING, Self, TypeVar

if TYPE_CHECKING:
    from account.models import PermissionDetail
    from django.db.models import Model


class FunctionModule:
    def __init__(
        self: Self,
        module_id: str,
        module_name: str,
        bound_model: type[Model] | None = None,
    ) -> None:
        self.module_id = module_id
        self.module_name = module_name
        self.bound_model = bound_model

    def __str__(self: Self) -> str:
        return self.module_id


class PermissionGroup:
    """
    在 PermissionGroup 中定義的權限 (PermissionScope) 順序會反應在前端的顯示上
    """

    bound_model: type[Model] | None = None
    module: FunctionModule | None = None
    group_name: str | None = None
    group_id: str | None = None
    hidden: bool = False

    # define the PermissionGroup order in the module
    group_order: int = 0


class Operation:
    """
    A permission operation may include multiple permission scopes
    and represents a single checkbox on the UI.
    """

    def __init__(
        self: Self,
        operation_id: str,
        operation_name: str,
        dependencies: list[Operation] | None = None,
    ) -> None:
        self.operation_id = operation_id
        self.operation_name = operation_name
        self.permission_scopes: list = []
        self.dependencies = dependencies or []

    def copy(self: Self) -> Operation:
        return Operation(self.operation_id, self.operation_name)


class PermissionScope:
    """
    Permission scope class
    """

    def __init__(
        self: Self,
        permission_id: str,
        permission_name: str,
        operation: Operation | None = None,
        bound_model: type[Model] | None = None,
    ) -> None:
        self.permission_id = permission_id
        self.permission_name = permission_name
        self.operation = operation
        self.bound_model = bound_model
        self.function_module: FunctionModule | None = None
        self.function_group_name: str | None = None
        self.group: PermissionGroup | None = None

        if operation:
            operation.permission_scopes.append(self)

    def __str__(self: Self) -> str:
        return self.permission_id

    def copy(self: Self) -> PermissionScope:
        return PermissionScope(
            self.permission_id,
            self.permission_name,
            operation=self.operation,
        )


definition_class = TypeVar("definition_class", bound=PermissionGroup)


class PermissionLayout:
    """
    Permission layout class
    """

    def __init__(self: Self) -> None:
        self.groups: dict[str, dict] = {}
        self.permissions: dict[str, PermissionScope] = {}

    def register(
        self: Self,
        definition_class: type[definition_class],
    ) -> type[definition_class]:
        """
        register a permission group with a descriptive class
        """
        defined_permission_scope = definition_class.__dict__.values()
        operations: dict[str, dict] = {}
        if definition_class.group_id is None:
            raise ValueError("PermissionGroup must have a group_id")
        self.groups[definition_class.group_id] = {
            "group_definition": definition_class,
            "operations": operations,
            "group_order": definition_class.group_order,
        }

        for permission_scope in defined_permission_scope:
            if isinstance(permission_scope, PermissionScope):
                permission_scope.group = definition_class  # type: ignore
                permission_scope.function_module = definition_class.module
                permission_scope.function_group_name = definition_class.group_name
                self.permissions[permission_scope.permission_id] = permission_scope
                permission_scope.bound_model = (
                    permission_scope.bound_model
                    or definition_class.bound_model
                    or (
                        definition_class.module.bound_model
                        if definition_class.module
                        else None
                    )
                )

                if permission_scope.operation:
                    if permission_scope.operation.operation_id not in operations:
                        operations[permission_scope.operation.operation_id] = {
                            "operation": permission_scope.operation,
                            "permissions": {},
                        }
                    permissions = operations[permission_scope.operation.operation_id][
                        "permissions"
                    ]
                    permissions[permission_scope.permission_id] = permission_scope

        return definition_class

    def copy(self: Self) -> PermissionLayout:
        """
        Creates a clone of the permission layout
        """
        new_layout = PermissionLayout()
        for group_id, group in self.groups.items():
            new_layout.groups[group_id] = group
        for permission_id, permission in self.permissions.items():
            new_layout.permissions[permission_id] = permission.copy()
        return new_layout

    def to_json(
        self: Self,
        permission_detail_map: dict[str, PermissionDetail] | None = None,
    ) -> list[dict]:
        from account.permissions import module_permission
        from assets.permissions import module_asset
        from audience.permissions import module_audience
        from campaign.permissions import module_campaign
        from datahub.permissions import module_datahub
        from journey.permissions import module_journey
        from notification.permissions import module_notification
        from system.permissions import module_general

        # 此陣列中的順序會影響到前端列表呈現順序
        module_list = [
            module_datahub,
            module_audience,
            module_campaign,
            module_asset,
            module_journey,
            module_permission,
            module_notification,
            module_general,
        ]
        modules = {
            module.module_id: {
                "id": module.module_id,
                "name": module.module_name,
                "permission_groups": [],
            }
            for module in module_list
        }
        for group_id, group_data in sorted(
            permission_layout.groups.items(),
            key=lambda item: item[1]["group_order"],
        ):
            operation_list = []
            if group_data["group_definition"].hidden:
                continue
            for operation_id, operation_data in group_data["operations"].items():
                value = list(operation_data["permissions"].keys())
                operation = {
                    "id": operation_id,
                    "name": operation_data["operation"].operation_name,
                    "value": list(value),
                    "validate": [
                        x.operation_id for x in operation_data["operation"].dependencies
                    ],
                }
                if permission_detail_map:
                    operation["can_edit"] = permission_detail_map[value[0]].is_editable
                operation_list.append(operation)
            modules[group_data["group_definition"].module.module_id][
                "permission_groups"
            ].append(
                {
                    "id": group_id,
                    "name": group_data["group_definition"].group_name,
                    "permissions": operation_list,
                },
            )
        return list(modules.values())


permission_layout = PermissionLayout()
