import {useEffect, useState} from "react";
import {GetProjectFiles} from "../../../../../routes/routes";
import useError from "../../../../../hooks/useError";
import {useParams} from "react-router-dom";

function ProjectFiles() {

    const [isLoading, setIsLoading] = useState(false);
    const setError = useError()


    // useEffect(() => {
    //     const fetchData = async () => {
    //         setIsLoading(true)
    //         try {
    //             const response = GetProjectFiles(id, sample)
    //             console.log(response)
    //             console.log(fetchData)
    //             console.log(GetProjectFiles)
    //             setIsLoading(false)
    //         } catch (err) {
    //             setError(err);
    //         }
    //     }
    //     fetchData();
    // }, [0])

    const params = useParams()
    let {id} = useParams();
    console.log(params)

    return (
        <>
            Project files
        </>
    )
}

export default ProjectFiles
