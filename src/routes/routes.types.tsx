import {Method} from "axios";
import {date} from "yup";

export type TRequest = (method: Method, url: string, params?: any) => any;

export interface ILoginParams {
    username: string,
    password: string,
    client_id: number,
    client_secret: string,
    grant_type: string,
}

export interface IResetParams {
    email: string
}

export interface ICreateUserParams {
    first_name: string
    last_name: string
    birthdate: Date,
    email: string
    roles: number[]
    phone_number: string
    gender: string
}

export interface ICreateRoleParams {
    name: string
    permissions: []
}

export interface CreateUserParams {
    invitation_token: string
    password: string
    password_confirmation: string
    first_name: string
    last_name: string
    birthdate: number | string
    phone_number: string
    gender: string

}

export interface UserInvitationParams {
    email: string
    token: string
}

export interface ForgotPasswordParams {
    email: string
}

export interface ResetPasswordParams {
    token: string
    email: string
    password: string
    password_confirmation: string
}

export interface InviteUserParams {
    email: string
    roles: number
}

export interface UpdatePasswordParams {
    old_password: string
    new_password: string
    new_password_confirmation: string
}

export interface UpdateUserInfoParams {
    first_name: string
    last_name: string
    birthdate: string
    phone_number: string
}

export interface RestoreDeletedUserParams {
    user_id: number
}

export interface CancelInvitationParams {
    invitation_token: string
}

export interface CreateClientParams {
    company_name: string
    email: string
    phone_number: string
    country: string
    city: string
    street: string
    postal_code: string
}

export interface RestoreDeletedClientParams {
    client_id: number
}

export interface UpdateClientsParams {
    company_name: string
    email: string
    phone_number: string
    country: string
    city: string
    street: string
    postal_code: string
    id: string
}

export interface RestoreDeletedProjectParams {
    project_id: number
}

export interface ICreateProjectParams {
    name: string
    client_id: number
    description: string
    start_date: Date
    end_date: Date
    resources: { employees?: [], tools?: [] }
    status_id: number
}

export interface ProjectResourceParams {
    resources: [],
    resource_type_id: number
}

export interface DeleteClientParams {
    clientId: number
}

export interface CreateCatalogParams {
    name: string,
    description: string,
    client_id: number
}

export interface IUpdateCatalogParams {
    name: string,
    description: string,
}

export interface CreateTaskParams {
    project_id: number,
    name: string,
    assignee_id: number,
    deadline: number,
    description: string,
    task_status_id: number,
    reporter_id: number,
}

export interface UpdateTaskParams {
    project_id: number,
    name: string,
    assignee_id: number,
    deadline: string,
    description: string
    task_status_id: number,
}

export interface ICreateToolParams {
    name: string
    serial_number: string
}

export interface IUpdateToolParams {
    name: string,
    serial_number: string,
}

export interface ICreateVehicleParams {
    manufacturer: string
    plate_number: string
}

export interface IUpdateVehicleParams {
    manufacturer: string
    plate_number: string
}

export interface CreateTaskComments {
    task_id: number,
    comment: string,
}

export interface ICreateBoardLeave {
    type: string
    start_date: Date
    end_date: Date
    start_time: Date
    end_time: Date
    employee_entry_type_id: number
    user_id: number
    status: string
}

export interface IUpdateBoardLeave {
    type: string
    start_date: Date
    end_date: Date
    start_time: Date
    end_time: Date
    status: string
}

export interface ICreateBoardTask {
    description: string
    start_date: Date
    end_date: Date
    start_time: Date
    end_time: Date
    project_entry_type_id: number
    assignee_id: number
    task_id: string
    project_id: number
}

export interface IUpdateBoardTask {
    description?: string
    start_date: Date
    end_date: Date
    start_time: Date
    end_time: Date
}

export interface ICreateBoardResource {
    description: string
    start_date: Date
    end_date: Date
    start_time: Date
    end_time: Date
    resource_entry_type_id: number
    resource_type_id: number
    resource_id: string
    project_id: number
}

export interface IUpdateBoardResource {
    description?: string
    start_date: Date
    end_date: Date
    start_time: Date
    end_time: Date
    resource_entry_type_id?: number
    resource_type_id?: number
    resource_id?: string
    project_id?: number
}

export interface ICreateBoardCustom {
    description: string
    start_date: Date
    end_date: Date
    start_time: Date
    end_time: Date
    entry_category_id: number
    employees: []
    type: string
}

export interface IUpdateBoardCustom {
    description: string
    start_date: Date
    end_date: Date
    start_time: Date
    end_time: Date
    entry_category_id: number
    employees: []
    type: string
}

export interface IapproveWorkLog {
    work_log: []
}

export interface employeeRejectApproveLeaves {
    status : string
}
