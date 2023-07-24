import {request, requestForList, requestWithoutToken} from "../services/ApiService";
import {
    CancelInvitationParams,
    CreateCatalogParams,
    CreateClientParams,
    CreateTaskComments,
    CreateTaskParams,
    CreateUserParams, employeeRejectApproveLeaves,
    ForgotPasswordParams, IapproveWorkLog, ICreateBoardCustom,
    ICreateBoardLeave, ICreateBoardResource, ICreateBoardTask,
    ICreateProjectParams,
    ICreateRoleParams,
    ICreateToolParams,
    ICreateUserParams,
    ICreateVehicleParams,
    ILoginParams,
    InviteUserParams, IUpdateBoardCustom,
    IUpdateBoardLeave, IUpdateBoardResource, IUpdateBoardTask,
    IUpdateCatalogParams,
    IUpdateToolParams,
    IUpdateVehicleParams,
    ProjectResourceParams,
    ResetPasswordParams,
    RestoreDeletedClientParams,
    RestoreDeletedProjectParams,
    RestoreDeletedUserParams,
    UpdateClientsParams,
    UpdatePasswordParams,
    UpdateTaskParams,
    UpdateUserInfoParams,
    UserInvitationParams
} from "./routes.types";


// function which makes request for userInformation
export const GetUserInfo = async () => {
    try {
        return await request('GET', `api/users/user-info`);
    } catch (err) {
        throw err
    }
}

export const getUserById = async (userId) => {
    try {
        return await request('GET', `api/users/${userId}`);
    } catch (err) {
        throw err
    }
}

// export const ListOfUsers = async () => {
//     try {
//         return await request('GET', `api/backoffice/employees?page=1`);
//     } catch (err) {
//         throw err
//     }
// }

export const getUsersTest = async () => {
    try {
        return await request('GET', `api/backoffice/users?page=1&pageSize=15`);
    } catch (err) {
        throw err
    }
}
export const getUsersOnChange = async (query) => {
    try {
        return await request('GET', `api/backoffice/users/search?q=${query}&pageSize=15`);
    } catch (err) {
        throw err
    }
}
export const ListOfUsers = async (currentPage, pageSize) => {
    try {
        return await requestForList('GET', `api/backoffice/users?page=${currentPage}&pageSize=${pageSize}`);
    } catch (err) {
        throw err
    }
}

export const DeleteUser = async (userId) => {
    try {
        return await requestForList('DELETE', `api/backoffice/users/${userId}`);
    } catch (err) {
        throw err
    }
}

export const getRoles = async () => {
    try {
        return await request('GET', `api/backoffice/roles`);
    } catch (err) {
        throw err
    }
}
export const getRolesById = async (id) => {
    try {
        return await request('GET', `api/backoffice/roles/${id}`);
    } catch (err) {
        throw err
    }
}

export const createRole = async (params: ICreateRoleParams) => {
    try {
        return await request('POST', `api/backoffice/roles`, params);
    } catch (err) {
        throw err
    }
}

export const getPermissions = async () => {
    try {
        return await request('GET', `api/backoffice/permissions`);
    } catch (err) {
        throw err
    }
}
export const syncPermissions = async (params) => {
    try {
        return await request('POST', `api/backoffice/roles/permissions/sync`, params);
    } catch (err) {
        throw err
    }
}

export const createUserFunction = async (params: ICreateUserParams) => {
    try {
        return await request('POST', `api/backoffice/users`, params);
    } catch (err) {
        throw err
    }
}

export const updateUserById = async (params, userId) => {
    try {
        return await request('PUT', `api/backoffice/users/${userId}`, params);
    } catch (err) {
        throw err
    }
}
export const updateUserRole = async (params) => {
    try {
        return await request('PUT', `api/backoffice/roles/sync`, params);
    } catch (err) {
        throw err
    }
}


// function which makes request for login
export const loginFunction = async (params: ILoginParams) => {
    try {
        return await requestWithoutToken('POST', `auth/token`, params);
    } catch (err) {
        throw err;
    }
}
export const logOut = async () => {
    try {
        return await request('POST', `api/auth/token/revoke`);
    } catch (err) {
        throw err;
    }
}

export const CreateUserBy = async (params: CreateUserParams) => {
    try {
        return await requestWithoutToken('POST', `api/users`, params);
    } catch (err) {
        throw err;
    }
}


export const UserInvitation = async (params: UserInvitationParams) => {
    try {
        return requestWithoutToken('GET', `api/backoffice/users/invitations/${params.token}`, params);
    } catch (err) {
        throw err;
    }
}


export const ForgotPasswordBy = async (params: ForgotPasswordParams) => {
    try {
        return await requestWithoutToken('POST', `api/password/forgot`, params);

    } catch (err) {
        throw err;
    }
}


export const ResetPasswordBy = async (params: ResetPasswordParams) => {
    try {
        return await requestWithoutToken('POST', `api/password/reset`, params);
    } catch (err) {
        throw err;
    }
}


export const InviteUserBy = async (params: InviteUserParams) => {
    try {
        return await request('POST', `api/backoffice/users/invitations?email=${params.email}&role_id=${params.roles}`, params);
    } catch (err) {
        throw err;
    }
}
export const changePassword = async (params: UpdatePasswordParams) => {
    try {
        return await request('POST', `api/users/password`, params);
    } catch (err) {
        throw err;
    }
}
export const updateUserInfo = async (params: UpdateUserInfoParams) => {
    try {
        return await request('PUT', `api/users/`, params);
    } catch (err) {
        throw err;
    }
}
export const allOfDeletedUsers = async () => {
    try {
        return await request('GET', `api/backoffice/users/deleted`);
    } catch (err) {
        throw err
    }
}
export const restoreUser = async (userId) => {
    try {
        return await request('POST', `api/backoffice/users/restore/${userId}`);
    } catch (err) {
        throw err
    }
}
export const renderInvitedUsers = async () => {
    try {

        return await request('GET', `api/backoffice/users/invitations/`);

    } catch (err) {
        throw err
    }
}
export const cancelInvitation = async (params: CancelInvitationParams) => {
    try {
        {
            return await request('DELETE', `api/backoffice/users/invitations/${params.invitation_token}`)
        }
    } catch (err) {
        throw err
    }
}
export const createClient = async (params: CreateClientParams) => {
    try {
        return await request('POST', `api/projects/clients`, params)
    } catch (err) {
        throw err
    }
}
export const listClients = async (currentPage, pageSize) => {
    try {
        return await requestForList('GET', `api/projects/clients?page=${currentPage}&pageSize=${pageSize}`)
    } catch (err) {
        throw err
    }
}

export const listOfClients = async () => {
    try {
        return await request('GET', `api/projects/clients?page=1&pageSize=15`);
    } catch (err) {
        throw err
    }
}

export const getClientsOnChange = async (query) => {
    try {
        return await request('GET', `api/projects/clients/search?q=${query}&pageSize=15`);
    } catch (err) {
        throw err
    }
}
export const deleteClient = async (clientId) => {
    try {
        return await request('DELETE', `api/projects/clients/${clientId}`)
    } catch (err) {
        throw err
    }
}
export const listDeletedClients = async () => {
    try {
        return await request('GET', `api/projects/clients/deleted?page=1`)
    } catch (err) {

        throw err
    }
}
export const restoreClient = async (params: RestoreDeletedClientParams) => {
    try {
        return await request('POST', `api/projects/clients/restore/${params.client_id}`)
    } catch (err) {
        throw err
    }
}

export const updateClient = async (params: UpdateClientsParams, clientId) => {
    try {
        return await request('PUT', `api/projects/clients/${clientId}`, params)
    } catch (err) {
        throw err
    }
}
export const GetClientById = async (id) => {
    try {
        return await request('GET', `api/projects/clients/${id}`)

    } catch (err) {
        throw err
    }
}

export const GetAllProjects = async (currentPage, pageSize) => {
    try {
        return await requestForList('GET', `api/projects?page=${currentPage}&pageSize=${pageSize}`)
    } catch (err) {
        throw err
    }
}
export const getProjects = async () => {
    try {
        return await request('GET', `api/projects`)
    } catch (err) {
        throw err
    }
}
export const getProjectsByCompanyId = async (companyId) => {
    try {
        return await requestForList('GET', `api/projects/clients/${companyId}/projects?page=1&pageSize=100`)
    } catch (err) {
        throw err
    }
}
export const getProjectsOnChange = async (query) => {
    try {
        return await request('GET', `api/projects/search?q=${query}&pageSize=15`);
    } catch (err) {
        throw err
    }
}
export const getProjectbyId = async (projectId) => {
    try {
        return await request('GET', `api/projects/${projectId}`);
    } catch (err) {
        throw err
    }
}

export const createProject = async (params: ICreateProjectParams) => {
    try {
        return await request('POST', `api/projects`, params);
    } catch (err) {
        throw err
    }
}

export const DeleteProjects = async (projectId) => {
    try {
        return await request('DELETE', `api/projects/${projectId}`)
    } catch (err) {
        throw err
    }
}
export const ListOfDeletedProjects = async () => {
    try {
        return await request('GET', `api/projects/deleted?page=1`)
    } catch (err) {
        throw err
    }
}

export const updateProject = async (params, projectId) => {
    try {
        return await request('PUT', `api/projects/${projectId}`, params);
    } catch (err) {
        throw err
    }
}
export const RestoreDeletedProject = async (params: RestoreDeletedProjectParams) => {
    try {
        return await request('POST', `/api/projects/restore/${params.project_id}`)
    } catch (err) {
        throw err
    }
}
export const getProjectStatus = async () => {
    try {
        return await request('GET', `api/projects/project-status`);
    } catch (err) {
        throw err
    }
}
export const createProjectResource = async (projectId, params: ProjectResourceParams) => {
    try {
        return await request('POST', `api/projects/${projectId}/resources`, params)
    } catch (err) {
        throw err
    }
}
export const getResourceTypes = async () => {
    try {
        return await request('GET', `api/projects/resource-types`)
    } catch (err) {
        throw err
    }
}
export const getEmployeeResources = async (projectID, currentPage, pageSize) => {
    try {
        return await requestForList('GET', `api/projects/${projectID}/employees?page=${currentPage}&pageSize=${pageSize}`)
    } catch (err) {
        throw err
    }
}
export const getToolResources = async (projectID, currentPage, pageSize) => {
    try {
        return await requestForList('GET', `api/projects/${projectID}/tools?page=${currentPage}&pageSize=${pageSize}`)
    } catch (err) {
        throw err
    }
}
export const getVehicleResources = async (projectID, currentPage, pageSize) => {
    try {
        return await requestForList('GET', `api/projects/${projectID}/vehicles?page=${currentPage}&pageSize=${pageSize}`)
    } catch (err) {
        throw err
    }
}

export const deleteProjectResource = async (project_Id, resource_type, resource_id) => {
    try {
        return await request('DELETE', `api/projects/${project_Id}/resources/${resource_type}/${resource_id}`)
    } catch (err) {
        throw err
    }
}
export const GetProjectFiles = async (id, sample) => {
    try {
        return await request('GET', `api/files/${id}/${sample}`)
    } catch (err) {
        throw err
    }
}
export const getCatalogsByClientID = async (clientId) => {
    try {
        return await request('GET', `api/projects/clients/${clientId}/catalogs`);
    } catch (err) {
        throw err
    }
}
export const getCatalogByCatalogID = async (catalogId) => {
    try {
        return await request('GET', `api/projects/catalogs/${catalogId}`);
    } catch (err) {
        throw err
    }
}

export const createCatalog = async (params: CreateCatalogParams) => {
    try {
        return await request('POST', `api/projects/catalogs`, params)
    } catch (err) {
        throw err
    }
}

export const deleteCatalogById = async (catalogId) => {
    try {
        return await request('DELETE', `api/projects/catalogs/${catalogId}`)
    } catch (err) {
        throw err
    }
}
export const updateCatalog = async (params: IUpdateCatalogParams, catalogId) => {
    try {
        return await request('PUT', `api/projects/catalogs/${catalogId}`, params)
    } catch (err) {
        throw err
    }
}
export const getNotificationsSettings = async () => {
    try {
        return await request('GET', `api/notifications/settings`)
    } catch (err) {
        throw err
    }
}
export const NotificationTypes = async (notificationTypeId, params) => {
    try {
        return await request('PUT', `api/notifications/settings/${notificationTypeId}`, params)
    } catch (err) {
        throw err
    }
}

export const getNotifications = async () => {
    try {
        return await request('GET', `api/notifications`)
    } catch (err) {
        throw err
    }
}

export const getNotificationsWithPagination = async (currentPage) => {
    try {
        return await requestForList('GET', `api/notifications?page=${currentPage}&pageSize=20`)
    } catch (err) {
        throw err
    }
}
export const getUnReadNotificationsWithPagination = async (currentPage) => {
    try {
        return await requestForList('GET', `api/notifications/unread?page=${currentPage}&pageSize=20`)
    } catch (err) {
        throw err
    }
}
export const getUnreadNotifications = async () => {
    try {
        return await request('GET', `api/notifications/unread`)
    } catch (err) {
        throw err
    }
}
export const markNotificationAsReadById = async (notificationId) => {
    try {
        return await request('POST', `api/notifications/mark-as-read/${notificationId}`)
    } catch (err) {
        throw err
    }
}
export const markAllNotificationsAsRead = async () => {
    try {
        return await request('POST', `api/notifications/mark-all-as-read`)
    } catch (err) {
        throw err
    }
}
export const deleteNotificationById = async (notificationId) => {
    try {
        return await requestForList('DELETE', `api/notifications/delete/${notificationId}`);
    } catch (err) {
        throw err
    }
}
export const createTask = async (params: CreateTaskParams) => {
    try {
        return await request('POST', `api/tasks`, params)
    } catch (err) {
        throw err
    }
}
export const getTaskStatus = async () => {
    try {
        return await request('GET', `api/tasks/statuses`)
    } catch (err) {
        throw err
    }
}

export const checkInToTaskById = async (taskId) => {
    try {
        return await request('POST', `api/tasks/${taskId}/check-in`)
    } catch (err) {
        throw err
    }
}

export const checkOutToTaskById = async (checkInId) => {
    try {
        return await request('POST', `api/tasks/${checkInId}/check-out`)
    } catch (err) {
        throw err
    }
}

export const prolongToTaskById = async (checkInId, params) => {
    try {
        return await request('POST', `api/tasks/${checkInId}/check-out/prolong`, params)
    } catch (err) {
        throw err
    }
}

export const getTaskWorkLogs = async (taskId) => {
    try {
        return await request('GET', `api/tasks/${taskId}/work-logs`)
    } catch (err) {
        throw err
    }
}
export const Task = async (taskNumber) => {
    try {
        return await request('GET', `api/tasks/${taskNumber}`)
    } catch (err) {
        throw err
    }
}

export const getTasksForProject = async (projectId, status = null) => {
    try {
        return await request('GET', `api/tasks/project/${projectId}?status=${status}`)
    } catch (err) {
        throw err
    }
}

export const getSearchedTasksByStatus = async (id, query, status = null) => {
    try {
        return await request('GET', `api/tasks/${id}/search?q=${query}?status=${status}`)
    } catch (err) {
        throw err
    }
}
export const DeleteTask = async (id) => {
    try {
        return await request('DELETE', `api/tasks/${id}`)
    } catch (err) {
        throw err
    }
}
export const UpdateTask = async (params: UpdateTaskParams, taskNumber) => {
    try {
        return await request('PUT', `api/tasks/${taskNumber}`, params)
    } catch (err) {
        throw err
    }
}
export const getTools = async () => {
    try {
        return await request('GET', `api/projects/tools?page=1&pageSize=15`);
    } catch (err) {
        throw err
    }
}
export const getToolsWithPagination = async (currentPage, pageSize) => {
    try {
        return await requestForList('GET', `api/projects/tools?page=${currentPage}&pageSize=${pageSize}`);
    } catch (err) {
        throw err
    }
}
export const getToolsOnChange = async (query) => {
    try {
        return await request('GET', `api/projects/tools/search?q=${query}&pageSize=15`);
    } catch (err) {
        throw err
    }
}

export const createTool = async (params: ICreateToolParams) => {
    try {
        return await request('POST', `api/projects/tools`, params);
    } catch (err) {
        throw err
    }
}

export const deleteToolbyId = async (toolId) => {
    try {
        return await request('DELETE', `api/projects/tools/${toolId}`);
    } catch (err) {
        throw err
    }
}
export const getToolById = async (toolId) => {
    try {
        return await request('GET', `api/projects/tools/${toolId}`);
    } catch (err) {
        throw err
    }
}

export const updateToolById = async (params: IUpdateToolParams, toolId) => {
    try {
        return await request('PUT', `api/projects/tools/${toolId}`, params);
    } catch (err) {
        throw err
    }
}
export const getVehicles = async () => {
    try {
        return await request('GET', `api/projects/vehicles?page=1&pageSize=15`);
    } catch (err) {
        throw err
    }
}
export const getVehiclesOnChange = async (query) => {
    try {
        return await request('GET', `api/projects/vehicles/search?q=${query}&pageSize=15`);
    } catch (err) {
        throw err
    }
}
export const getVehiclesWithPagination = async (currentPage, pageSize) => {
    try {
        return await requestForList('GET', `api/projects/vehicles?page=${currentPage}&pageSize=${pageSize}`);
    } catch (err) {
        throw err
    }
}
export const createVehicle = async (params: ICreateVehicleParams) => {
    try {
        return await request('POST', `api/projects/vehicles`, params);
    } catch (err) {
        throw err
    }
}
export const deleteVehicleById = async (toolId) => {
    try {
        return await request('DELETE', `api/projects/vehicles/${toolId}`);
    } catch (err) {
        throw err
    }
}
export const updateVehicleById = async (params: IUpdateVehicleParams, vehicleId) => {
    try {
        return await request('PUT', `api/projects/vehicles/${vehicleId}`, params);
    } catch (err) {
        throw err
    }
}
export const getTaskComments = async (taskId) => {
    try {
        return await request('GET', `api/tasks/${taskId}/comments`,);
    } catch (err) {
        throw err
    }
}
export const DeleteTaskComment = async (commentId) => {
    try {
        return await request('DELETE', `api/tasks/comments/${commentId}`)
    } catch (err) {
        throw err
    }
}

export const CreateTaskComment = async (params: CreateTaskComments) => {
    try {
        return await request('POST', `api/tasks/comments`, params)
    } catch (err) {
        throw err
    }
}

export const getCategoryEntries = async () => {
    try {
        return await request('GET', `api/board/entry`);
    } catch (err) {
        throw err
    }
}
export const getEmployeeEntryTypes = async () => {
    try {
        return await request('GET', `api/board/employee-entry-types`);
    } catch (err) {
        throw err
    }
}
export const getResourceEntryTypes = async () => {
    try {
        return await request('GET', `api/board/resource-entry-types`);
    } catch (err) {
        throw err
    }
}

export const getBoardTask = async () => {
    try {
        return await request('GET', `api/board/tasks`);
    } catch (err) {
        throw err
    }
}
export const getBoardTaskById = async (boardTaskId) => {
    try {
        return await request('GET', `api/board/tasks/${boardTaskId}`);
    } catch (err) {
        throw err
    }
}
export const createNewBoardTask = async (params: ICreateBoardTask) => {
    try {
        return await request('POST', `api/board/tasks`, params);
    } catch (err) {
        throw err
    }
}

export const deleteBoardTask = async (boardTaskId) => {
    try {
        return await request('DELETE', `api/board/tasks/${boardTaskId}`);
    } catch (err) {
        throw err
    }
}

export const updateBoardTaskById = async (params: IUpdateBoardTask, boardTaskId) => {
    try {
        return await request('PUT', `api/board/tasks/${boardTaskId}`, params);
    } catch (err) {
        throw err
    }
}

export const getBoardLeaves = async () => {
    try {
        return await request('GET', `api/board/leaves`);
    } catch (err) {
        throw err
    }
}
export const getBoardLeaveById = async (boardLeaveId) => {
    try {
        return await request('GET', `api/board/leaves/${boardLeaveId}`);
    } catch (err) {
        throw err
    }
}
export const createNewBoardLeave = async (params: ICreateBoardLeave) => {
    try {
        return await request('POST', `api/board/leaves`, params);
    } catch (err) {
        throw err
    }
}
export const deleteBoardLeave = async (boardLeaveId) => {
    try {
        return await request('DELETE', `api/board/leaves/${boardLeaveId}`);
    } catch (err) {
        throw err
    }
}
export const updateBoardLeaveById = async (params: IUpdateBoardLeave, boardLeaveId) => {
    try {
        return await request('PUT', `api/board/leaves/${boardLeaveId}`, params);
    } catch (err) {
        throw err
    }
}

export const getBoardResource = async () => {
    try {
        return await request('GET', `api/board/resources`);
    } catch (err) {
        throw err
    }
}
export const getBoardResourceById = async (boardResourceId) => {
    try {
        return await request('GET', `api/board/resources/${boardResourceId}`);
    } catch (err) {
        throw err
    }
}

export const createNewBoardResource = async (params: ICreateBoardResource) => {
    try {
        return await request('POST', `api/board/resources`, params);
    } catch (err) {
        throw err
    }
}
export const deleteBoardResource = async (boardResourceId) => {
    try {
        return await request('DELETE', `api/board/resources/${boardResourceId}`);
    } catch (err) {
        throw err
    }
}

export const updateBoardResourceById = async (params: IUpdateBoardResource, boardResourceId) => {
    try {
        return await request('PUT', `api/board/resources/${boardResourceId}`, params);
    } catch (err) {
        throw err
    }
}

export const getBoardCustom = async () => {
    try {
        return await request('GET', `api/board/customs`);
    } catch (err) {
        throw err
    }
}

export const getBoardCustomById = async (boardCustomId) => {
    try {
        return await request('GET', `api/board/customs/${boardCustomId}`);
    } catch (err) {
        throw err
    }
}

export const createNewBoardCustom = async (params: ICreateBoardCustom) => {
    try {
        return await request('POST', `api/board/customs`, params);
    } catch (err) {
        throw err
    }
}

export const updateBoardCustomById = async (params: IUpdateBoardCustom, boardCustomId) => {
    try {
        return await request('PUT', `api/board/customs/${boardCustomId}`, params);
    } catch (err) {
        throw err
    }
}

export const deleteBoardCustom = async (boardCustomId) => {
    try {
        return await request('DELETE', `api/board/customs/${boardCustomId}`);
    } catch (err) {
        throw err
    }
}

export const NewestComments = async (taskNumber) => {
    try {
        return await request('GET', `api/tasks/comments/${taskNumber}/filterNewest`, taskNumber)
    } catch (err) {
        throw err
    }
}

export const OldestComments = async (taskNumber) => {
    try {
        return await request('GET', `api/tasks/comments/${taskNumber}/filterOldest`, taskNumber)
    } catch (err) {
        throw err
    }
}


export const getSearchInfoOnChange = async (query) => {
    try {
        return await request('GET', `api/backoffice/search?q=${query}`);
    } catch (err) {
        throw err
    }
}

export const updateCommentOfTask = async (commentId, params) => {
    try {
        return await request('PUT', `api/tasks/comments/${commentId}`, params)
    } catch (err) {
        throw err
    }
}
export const getSearchTasksOnChange = async (id, query) => {
    try {
        return await request('GET', `api/tasks/${id}/search?q=${query}`)
    } catch (err) {
        throw err
    }
}
export const getWorkLogs = async (id, authUser) => {
    try {
        return await request('GET', `api/tasks/${id}/employees/work-logs?assignee_id=${authUser}`)
    } catch (err) {
        throw err
    }
}

export const approveWorkLogOption = async (params: IapproveWorkLog) => {
    try {
        return await request('PUT', `api/tasks/work-logs/approve`, params)
    } catch (err) {
        throw err
    }
}
export const getEmployeeLeaves = async (currentPage, pageSize) => {
    try {
        return await requestForList('GET', `api/board/leaves?page=${currentPage}&pageSize=${pageSize}`)
    } catch (err) {
        throw err
    }
}


export const employeeApproveReject = async (params: employeeRejectApproveLeaves, leaveID) => {
    try {
        return await request('PUT', `api/board/leaves/status/${leaveID}`, params);
    } catch (err) {
        throw err;
    }
}





