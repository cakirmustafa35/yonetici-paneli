import React, { useState, useEffect } from 'react';
import DataGrid, { Column, Editing, Popup, Form, Button } from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.light.css';
import api from '../services/api';
import gridOperations from '../services/gridService';

function Users() {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = async () => {
        try {
            setLoading(true);
            const [usersResponse, departmentsResponse] = await Promise.all([
                api.get('/users'),
                api.get('/departments')
            ]);
            setUsers(usersResponse.data);
            setDepartments(departmentsResponse.data);
            setError(null);
        } catch (error) {
            console.error('Error loading data:', error);
            setError('Veriler yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleGridAction = async (actionType, e) => {
        try {
            let result;
            switch (actionType) {
                case 'add':
                    result = await gridOperations.handleGridAdd(e);
                    break;
                case 'update':
                    result = await gridOperations.handleGridUpdate(e);
                    break;
                case 'delete':
                    result = await gridOperations.handleGridDelete(e);
                    break;
                default:
                    return;
            }

            if (result && result.success) {
                await loadData();
                e.component.refresh();
            } else {
                console.error(`${actionType} operation failed:`, result?.error);
                e.component.cancelEditData();
            }
        } catch (error) {
            console.error(`Error in ${actionType} operation:`, error);
            e.component.cancelEditData();
        }
    };

    if (loading) {
        return <div className="loading-container">Yükleniyor...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    return (
        <div className="users-container">
            <h1>Kullanıcılar</h1>
            <DataGrid
                dataSource={users}
                keyExpr="id"
                showBorders={false}
                columnAutoWidth={true}
                rowAlternationEnabled={false}
                showColumnLines={false}
                showRowLines={true}
                onRowInserting={(e) => handleGridAction('add', e)}
                onRowUpdating={(e) => handleGridAction('update', e)}
                onRowRemoving={(e) => handleGridAction('delete', e)}
                onInitialized={() => console.log('Grid initialized')}
                onOptionChanged={(e) => console.log('Option changed:', e)}
            >
                <Editing
                    mode="popup"
                    allowUpdating={true}
                    allowDeleting={true}
                    allowAdding={true}
                >
                    <Popup title="Kullanıcı" showTitle={true} width={700} height={525} />
                </Editing>

                <Column dataField="name" caption="Ad Soyad" />
                <Column dataField="email" caption="E-posta" />
                <Column
                    dataField="departmentId"
                    caption="Departman"
                    lookup={{
                        dataSource: departments,
                        valueExpr: 'id',
                        displayExpr: 'name'
                    }}
                />
                <Column
                    dataField="role"
                    caption="Rol"
                    lookup={{
                        dataSource: [
                            { id: 'admin', text: 'Admin' },
                            { id: 'user', text: 'Kullanıcı' }
                        ],
                        valueExpr: 'id',
                        displayExpr: 'text'
                    }}
                />
                <Column
                    dataField="status"
                    caption="Durum"
                    lookup={{
                        dataSource: [
                            { id: 'active', text: 'Aktif' },
                            { id: 'inactive', text: 'Pasif' }
                        ],
                        valueExpr: 'id',
                        displayExpr: 'text'
                    }}
                />
                <Column
                    dataField="phone"
                    caption="Telefon"
                />
                <Column
                    dataField="address"
                    caption="Adres"
                />
                <Column
                    dataField="lastLoginDate"
                    caption="Son Giriş"
                    dataType="datetime"
                    format="dd.MM.yyyy HH:mm"
                />
                <Column
                    dataField="createdAt"
                    caption="Kayıt Tarihi"
                    dataType="datetime"
                    format="dd.MM.yyyy HH:mm"
                />
                <Column type="buttons" width={110}>
                    <Button name="edit" />
                    <Button name="delete" />
                </Column>
            </DataGrid>
        </div>
    );
}

export default Users;