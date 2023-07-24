import {
    LoadingIcon
} from "@/components";
import {useState, useEffect} from "react";
import {getRoles} from "../../../../routes/routes";
import useError from "../../../../hooks/useError";
import CustomTable from "../../../../components/customTable/Main"
import moment from "moment";
import {useNavigate} from "react-router-dom";

function Main() {
    const [isLoading, setIsLoading] = useState(false);
    const [roles, setRoles] = useState([])
    const setError = useError()
    const column = [
        {heading: "ROLE NAME", value: "name"},
        {heading: "CREATED AT", value: 'created_at'},
        {heading: "PERMISSIONS", value: "permissions.permission"},
        {heading: "STATUS", value: 'status'},
        {heading: "ACTIONS", value: 'actions'},
    ]
    const content = 'Role'
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const response = await getRoles();
                setIsLoading(false)
                setRoles(response)
            } catch (err) {
                setError(err);
            }
        };
        fetchData();
    }, []);

    const navigateToCreateRole = () => {
        navigate('create')
    }
    const handleEdit = (id) => {
        navigate(`edit/${id}`)
    }
    return (
        isLoading ? (
            <div
                className="col-span-6 sm:col-span-3 xl:col-span-2 grid h-screen place-items-center">
                <LoadingIcon icon="puff" className="w-14 h-14"/>
            </div>
        ) : (
            <>

                <CustomTable data={roles} column={column} content={content} navigateToCreate={navigateToCreateRole}
                             onEdit={handleEdit}/>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                    {roles.map((role, i) => (
                        <div key={i} className="bg-white space-y-3 p-4 rounded-lg shadow">
                            <div className="flex items-center space-x-2 text-sm">
                                <div>
                                    <a href="#" className="text-blue-500 font-bold hover:underline">{role.id}</a>
                                </div>
                                <div className="text-gray-500">{moment(role.created_at).format("MMMM Do YYYY")}</div>
                                <div>
            <span
                className="p-1.5 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50">Active</span>
                                </div>
                            </div>
                            <div className="text-sm text-gray-700">
                                {role.name}
                            </div>
                            <div className="text-sm font-medium text-black">
                                {role.permissions.map((permission, i) => <div key={i}
                                                                              className="block">{permission.name}</div>)}
                            </div>
                        </div>
                    ))}
                </div>
            </>
        )
    );
}

export default Main;
