import {
    Lucide,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownContent,
    DropdownItem,
    Modal,
    ModalBody,
    Tippy
} from "@/components";
import {useState} from "react";
import classnames from "classnames";
import moment from "moment";

function Main({data, column, content, navigateToCreate, onEdit}) {

    return (
        <>
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12 flex justify-between flex-wrap sm:flex-nowrap items-center ">
                    <h2 className="intro-y text-lg font-medium mt-1 ">Roles List</h2>


                    <div className="w-full mr-2 sm:w-auto  ">
                        <div className="w-56 relative text-slate-500">
                            <input
                                type="text"
                                className="form-control w-56 box pr-10"
                                placeholder="Search..."
                            />
                            <Lucide
                                icon="Search"
                                className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"
                            />
                        </div>
                    </div>
                    <button className="btn btn-primary shadow-md mr-2" onClick={navigateToCreate}>
                        Add New {content}
                    </button>
                </div>
                {/* BEGIN: Data List */}
                <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
                    <table className="table table-report -mt-2">
                        <thead>
                        <tr>
                            {
                                column.map((item, index) => <TableHeadItem index={index} item={item}/>)
                            }
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((item, index) => {
                            const handleEdit = () => {
                                onEdit?.(item.id)
                            }
                            return (<TableRow onEdit={handleEdit} index={index} item={item} column={column}/>)
                        })}
                        </tbody>
                    </table>
                </div>
                {/* END: Data List */}
                {/* BEGIN: Pagination */}
                <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
                    <nav className="w-full sm:w-auto sm:mr-auto">
                        <ul className="pagination">
                            <li className="page-item">
                                <a className="page-link" href="#">
                                    <Lucide icon="ChevronsLeft" className="w-4 h-4"/>
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">
                                    <Lucide icon="ChevronLeft" className="w-4 h-4"/>
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">
                                    ...
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">
                                    1
                                </a>
                            </li>
                            <li className="page-item active">
                                <a className="page-link" href="#">
                                    2
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">
                                    3
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">
                                    ...
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">
                                    <Lucide icon="ChevronRight" className="w-4 h-4"/>
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">
                                    <Lucide icon="ChevronsRight" className="w-4 h-4"/>
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <select className="w-20 form-select box mt-3 sm:mt-0">
                        <option>10</option>
                        <option>25</option>
                        <option>35</option>
                        <option>50</option>
                    </select>
                </div>
                {/* END: Pagination */}
            </div>
        </>
    );
}

const TableHeadItem = ({item, index}) => <th className="text-center whitespace-nowrap" key={index}>{item.heading}</th>
const TableRow = ({item, index, column, onEdit}) => (
    <tr key={index}>
        {column.map((columnItem, i) => {
            const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
            const navigateToEdit = () => {
                onEdit?.()
            }
            if (columnItem.value.includes('.')) {
                const itemSplit = columnItem.value.split('.')
                const content = item[itemSplit[0]].map((x) => x.name + '\n')
                return <td
                    className={' whitespace-nowrap'}>{item[itemSplit[0]].slice(0, 1).map((x, i) => {
                    return (<div key={i} className={'block capitalize ml-5'}>{x.name} {item[itemSplit[0]].length > 1 ? (
                        <Tippy
                            className="tooltip block cursor-pointer"
                            tag={'div'}
                            content={`${content}`}
                            options={{
                                maxWidth: 500,
                                theme: "light"
                            }}
                        >
                            + {item[itemSplit[0]].length - 1} more
                        </Tippy>
                    ) : ('')}</div>)
                })}
                </td>
            } else if (columnItem.value.includes('status')) {
                return <td key={i} className="w-40">
                    <div
                        className={classnames({
                            "flex items-center justify-center": true,
                            "text-success": true,
                            "text-danger": false,
                        })}
                    >
                        <Lucide icon="CheckSquare" className="w-4 h-4 mr-2"/>
                        {true ? "Active" : "Inactive"}
                    </div>
                </td>
            } else if (columnItem.value.includes('actions')) {
                return <td key={i} className="table-report__action w-56">
                    <div className="flex justify-center items-center">
                        <button onClick={navigateToEdit} className="flex items-center mr-3" href="">
                            <Lucide icon="CheckSquare" className="w-4 h-4 mr-1"/>{" "}
                            Edit
                        </button>
                        <a
                            className="flex items-center text-danger"
                            onClick={() => {
                                setDeleteConfirmationModal(true);
                            }}
                        >
                            <Lucide icon="Trash2" className="w-4 h-4 mr-1"/> Delete
                        </a>
                    </div>
                    <Modal
                        show={deleteConfirmationModal}
                        onHidden={() => {
                            setDeleteConfirmationModal(false);
                        }}
                    >
                        <ModalBody className="p-0">
                            <div className="p-5 text-center">
                                <Lucide
                                    icon="XCircle"
                                    className="w-16 h-16 text-danger mx-auto mt-3"
                                />
                                <div className="text-3xl mt-5">Are you sure?</div>
                                <div className="text-slate-500 mt-2">
                                    Do you really want to delete these records? <br/>
                                    This process cannot be undone.
                                </div>
                            </div>
                            <div className="px-5 pb-8 text-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDeleteConfirmationModal(false);
                                    }}
                                    className="btn btn-outline-secondary w-24 mr-1"
                                >
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-danger w-24">
                                    Delete
                                </button>
                            </div>
                        </ModalBody>
                    </Modal>
                </td>
            } else if (columnItem.value.includes('created_at')) {
                return (<td key={i}
                            className={'text-center whitespace-nowrap'}>{moment(item[`${columnItem.value}`]).format("MMMM Do YYYY")}</td>)
            }
            return (<td key={i}>{item[`${columnItem.value}`]}</td>)
        })}
    </tr>
)

export default Main;
