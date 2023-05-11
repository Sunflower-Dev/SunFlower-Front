import moment from 'moment';
import {Fragment, useEffect, useRef, useState} from 'react';
import {Route, useHistory} from 'react-router-dom';
import {axiosInstance} from '../../../axios-global';
import SecondaryButton from '../../UI/Bottons/SecondaryButton';
import AddClientDocument from '../Client/ClientProfile/AddDocument/AddDocument';
import AddNote from '../Client/ClientProfile/AddNote/AddNote';
import DocumentItem from '../Client/ClientProfile/TabView/DocumentItem/DocumentItem';
import NoteItem from '../Client/ClientProfile/TabView/NoteItem/NoteItem';
import classes from './OnlineOffice.module.css';
import LoadingSpinner from '../../UI/LoadingSpinner';
import AddService from './AddService/AddService';
import {useSelector} from 'react-redux';
import DeleteDocumentConfirm from '../../UI/Popup/DeleteDocumentConfirm/DeleteDocumentConfirm';
import RequestDeleteDocument from '../../UI/Popup/RequestDeleteDocument/RequestDeleteDocument';

const OnlineOffice = () => {
    const [ActiveTab, setActiveTab] = useState('Deputys');
    const [Deputys, SetDeputys] = useState(null);
    const [Documents, SetDocuments] = useState(null);
    const [Notes, SetNotes] = useState(null);
    const [Services, SetServices] = useState(null);
    const [IsActionOpen, setIsActionOpen] = useState(false);

    const TabsRef = useRef(null);

    const history = useHistory();

    const Permissions = JSON.parse(useSelector(state => state.Auth.Admin)).Permissions;

    useEffect(() => {
        (async () => {
            try {
                const call = await axiosInstance.get('/online-office');
                var response = call.data;
                SetDeputys(response.Admins);
                SetDocuments(response.OnlineOffice.Documents);
                SetNotes(response.OnlineOffice.Notes);
                var TMPServices = response.OnlineOffice.Services;
                TMPServices.forEach(element => {
                    var DocCount = 0;
                    element.Folders.forEach(folder => {
                        DocCount += folder.Documents.length;
                    });
                    element.DocCount = DocCount;
                });
                SetServices(TMPServices);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    const TabChangeHandler = Tab => {
        setActiveTab(Tab);
    };

    const openActionHandler = () => {
        if (IsActionOpen) {
            setIsActionOpen(false);
        } else {
            setIsActionOpen(true);
        }
    };

    const AddDocumentClickHandler = () => {
        history.push('/Online-Office/AddDocument');
    };
    const AddNoteClickHandler = () => {
        history.push('/Online-Office/AddNote');
    };
    const AddServiceClickHandler = () => {
        history.push('/Online-Office/AddService');
    };

    const ServiceOpenClickHandler = id => {
        history.push('/Online-Office/Service/' + id);
    };

    return !Deputys ? (
        <LoadingSpinner/>
    ) : (
        <div className={classes.Container}>
            <section style={{height: window.innerWidth > 550 && '100%'}}>
                <div className={`${classes.Tabs}`} ref={TabsRef}>
                    <div
                        className={`${classes.TabItem} ${ActiveTab === 'Deputys' && classes.active}`}
                        onClick={() => TabChangeHandler('Deputys')}
                    >
                        Deputys
                    </div>
                    <div
                        className={`${classes.TabItem} ${ActiveTab === 'Documents' && classes.active}`}
                        onClick={() => TabChangeHandler('Documents')}
                    >
                        Documents
                    </div>
                    <div
                        className={`${classes.TabItem} ${ActiveTab === 'Notes' && classes.active}`}
                        onClick={() => TabChangeHandler('Notes')}
                    >
                        Notes
                    </div>
                    <div
                        className={`${classes.TabItem} ${ActiveTab === 'Services' && classes.active}`}
                        onClick={() => TabChangeHandler('Services')}
                    >
                        Services
                    </div>
                </div>

                <div className={`${classes.tabbody} ${ActiveTab === 'Deputys' && classes.active}`}>
                    <div className={`${classes.tabHeader} ${window.innerWidth > 550 ? 'mb-25' : 'mb-15'}`}>
                        <h2 className={`${window.innerWidth > 550 ? 'font-600 size-14' : 'font-700 size-10'} text-black m-0`}>Deputys</h2>
                        {/* <SecondaryButton >
                                <img style={{ marginRight: "8px" }} src="/svg/filter-gray.svg" width="20px" alt="Filter" />
                                Filter
                            </SecondaryButton> */}
                    </div>
                    {Deputys.map(item => (
                        <div className={`${classes.DeputyItem} ${window.innerWidth > 550 ? 'mt-15' : 'mb-10'}`}
                             key={item._id}>
                            <img src={process.env.REACT_APP_SRC_URL + item.Avatar} alt='Avatar'/>
                            <div
                                className={`font-500 ${window.innerWidth > 550 ? 'size-6' : 'size-3'} text-darkgray`}>{item.Name}</div>
                            <div
                                className={`font-400 ${window.innerWidth > 550 ? 'size-4' : 'size-1'} text-lightgray ${classes.DeputyText}`}
                            >
                                Deputy
                            </div>
                            <SecondaryButton className={classes.DeputyButton}
                                             onClick={() => history.push('/Messages/' + item._id)}>
                                <img src='/svg/Message-ic.svg' alt='' width={window.innerWidth > 550 ? 20 : 16}/>
                            </SecondaryButton>
                            {Permissions.View.includes('staff') && (
                                <SecondaryButton
                                    className={classes.DeputyButton}
                                    style={{marginLeft: '4px'}}
                                    onClick={() => history.push('/Staff/' + item._id + '/Detail')}
                                >
                                    <div
                                        className={`font-500 ${window.innerWidth > 550 ? 'size-4' : 'size-1'} text-darkgray`}>
                                        View file
                                    </div>
                                </SecondaryButton>
                            )}
                        </div>
                    ))}
                </div>

                <div
                    className={`${classes.Documents} ${classes.tabbody} ${ActiveTab === 'Documents' && classes.active}`}>
                    <div className={classes.tabHeader}>
                        <h2 className={`${window.innerWidth > 550 ? 'font-600 size-14' : 'font-700 size-10'} text-black m-0`}>Documents</h2>
                        {/* <SecondaryButton >
                                <img style={{ marginRight: "8px" }} src="/svg/filter-gray.svg" width="20px" alt="Filter" />
                                Filter
                            </SecondaryButton> */}
                    </div>
                    {Permissions.Edit.includes('online-office') && window.innerWidth > 550 && (
                        <div className={`${classes.UploadContainer}`} onClick={AddDocumentClickHandler}>
                            <img alt='download' src='/svg/vector/download-80.svg' width='80px'/>
                            <span className={`size-8 font-400 text-lightgray`}>Upload your document</span>
                        </div>
                    )}
                    {Documents && Documents.map(item => <DocumentItem key={item._id} data={item}/>)}
                </div>

                <div className={`${classes.Notes} ${classes.tabbody} ${ActiveTab === 'Notes' && classes.active}`}>
                    <div className={classes.tabHeader}>
                        <h2 className={`${window.innerWidth > 550 ? 'font-600 size-14' : 'font-700 size-10'} text-black m-0`}>Notes</h2>
                        {/* <SecondaryButton >
                                <img style={{ marginRight: "8px" }} src="/svg/filter-gray.svg" width="20px" alt="Filter" />
                                Filter
                            </SecondaryButton> */}
                    </div>

                    {Permissions.Edit.includes('online-office') && window.innerWidth > 550 && (
                        <div className={`${classes.AddNote}`} onClick={AddNoteClickHandler}>
                            <img src='/svg/vector/add-80.svg' width='80px' alt='add'/>
                            <div className={`text-lightgray font-400 size-8 mt-10`}>Add Note</div>
                        </div>
                    )}


                    {Notes &&
                        Notes.map(item => (
                                <NoteItem
                                    key={item._id}
                                    data={{
                                        Title: item.Title,
                                        Description: item.Description,
                                        Name: item.Admins && item.Admins.length > 0 ? item.Admins[0].Name : "Unknown",
                                        Date: moment(item.CreatedAt).format('DD MMM \xa0\xa0|\xa0\xa0 hh:mmA'),
                                        id: item._id,
                                        Avatar: item.Admins && item.Admins.length > 0 ? item.Admins[0].Avatar : "",
                                    }}
                                />
                        ))}
                </div>

                <div className={`${classes.tabbody} ${ActiveTab === 'Services' && classes.active}`}>
                    <div className={`${classes.tabHeader} mb-25`}>
                        <h2 className={`${window.innerWidth > 550 ? 'font-600 size-14' : 'font-700 size-10'} text-black m-0`}>Services</h2>
                        {Permissions.Edit.includes('online-office') && window.innerWidth > 550 && (
                            <SecondaryButton onClick={AddServiceClickHandler}>
                                <img style={{marginRight: '8px'}} src='/svg/plus-gray.svg' width='20px' alt='Filter'/>
                                Add service
                            </SecondaryButton>
                        )}
                    </div>

                    {Services &&
                        Services.map((item, index) => (
                            <div
                                className={`${classes.ServiceItem} mb-15`}
                                key={item._id}
                                onClick={() => ServiceOpenClickHandler(item._id)}
                            >
                                <div className={`${classes.ServiceCounter}`}>{index + 1}</div>
                                <div
                                    className={`font-500 ${window.innerWidth > 550 ? 'size-6' : 'size-3'} text-darkgray`}>
                                    {item.Title}
                                </div>
                                {window.innerWidth > 550 ? (
                                    <>
                                        <div className={`font-400 size-4 text-lightgray ${classes.ServiceInfo}`}>
                                            {item.DocCount} Documents &nbsp;|&nbsp; {item.Folders.length} Folders &nbsp;|&nbsp;{' '}
                                            {moment(item.CreatedAt).format('DD/MM/YYYY')}
                                        </div>
                                        <div
                                            className={`font-400 size-5 text-lightgray mr-24 pl-25 ${classes.ServiceDescription}`}>
                                            {item.Description}
                                        </div>
                                    </>
                                ) : (
                                    <div className={`font-400 size-1 text-lightgray ${classes.ServiceInfo}`}>
                                        {item.DocCount} Documents &nbsp;|&nbsp; {item.Folders.length} Folders &nbsp;|&nbsp;{' '}
                                        {moment(item.CreatedAt).format('DD/MM/YYYY')}
                                    </div>
                                )}
                                {window.innerWidth > 550 ? (
                                    <div className={`${classes.ServiceArrow}`}>
                                        <img src='/svg/arrow-right.svg' alt=''/>
                                    </div>
                                ) : (
                                    <img src='/svg/arrow-right.svg' alt='' width={24}/>
                                )}
                            </div>
                        ))}
                </div>
            </section>

            {Permissions.Edit.includes('online-office') && (
                <>
                    <Route path='/Online-Office/AddDocument'>
                        <AddClientDocument Type='OnlineOffice'/>
                    </Route>
                    {window.innerWidth > 550 && (
                        <>
                            <Route path='/Online-Office/EditNote/:NoteID'>
                                <AddNote Page='OnlineOffice' type='EDIT' Notes={Notes}/>
                            </Route>
                            <Route path='/Online-Office/AddNote'>
                                <AddNote Page='OnlineOffice' type='NEW'/>
                            </Route>
                            <Route path='/Online-Office/AddService'>
                                <AddService type='NEW'/>
                            </Route>
                        </>
                    )}
                </>
            )}
            <Route path={'/Online-Office/DeleteDocument/:DocumentId'}>
                {Permissions.Delete.includes('online-office') ? (
                    <DeleteDocumentConfirm get='/online-office/GetDocumentRequests/'
                                           delete='/online-office/DeleteDocumentConfirm/'/>
                ) : (
                    <RequestDeleteDocument urlPost='/online-office/RequestDeleteDocument/'/>
                )}
            </Route>

            {window.innerWidth < 550 && (
                <>
                    <div className={`${classes.ActionButton} ${IsActionOpen && classes.active}`}
                         onClick={openActionHandler}>
                        <img src='/svg/plus-white.svg' width={32} alt='action'/>
                    </div>
                    <div className={`${classes.ActionContainer} ${IsActionOpen && classes.active}`}>
                        <div className={`${classes.ActionItem}`}
                             onClick={() => history.push(history.location.pathname + '/AddService')}>
                            <div className={classes.ActionItemTitle}>Service</div>
                            <div className={classes.ActionItemIcon}>
                                <img src='/svg/flag.svg' width={24} alt='action'/>
                            </div>
                        </div>
                        <div className={`${classes.ActionItem}`}
                             onClick={() => history.push(history.location.pathname + '/AddNote')}>
                            <div className={classes.ActionItemTitle}>note</div>
                            <div className={classes.ActionItemIcon}>
                                <img src='/svg/note.svg' width={24} alt='action'/>
                            </div>
                        </div>
                        <div className={`${classes.ActionItem}`}
                             onClick={() => history.push(history.location.pathname + '/AddDocument')}>
                            <div className={classes.ActionItemTitle}>Documents</div>
                            <div className={classes.ActionItemIcon}>
                                <img src='/svg/attachment.svg' width={24} alt='action'/>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default OnlineOffice;
