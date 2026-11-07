import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PermComponent from '@/components/PermComponent';
// import Users from '@/pages/users/Users';
import UserList from '@/pages/users/Users';
import UserCreate from '@/pages/users/userCreate/UserCreate';
import UserListTrashed from '@/pages/users/userSoftDelete/UserTable';
import UserShow from '@/pages/users/userList/userShow/Modal';
import UserRoles from '@/pages/users/userList/userRoles/Modal';
import UserDevices from '@/pages/users/userList/userDevices/Modal';
import RoleList from '@/pages/roles/Roles';
import RoleCreate from '@/pages/roles/roleCreate/RoleCreate';
import RoleShow from '@/pages/roles/roleList/roleShow/Modal';
import RolePermissions from '@/pages/roles/roleList/rolePermissions/Modal';
import PermissionList from '@/pages/permissions/Permissions';
import PermissionCreate from '@/pages/permissions/permissionCreate/PermissionCreate';
import CategoryList from '@/pages/categories/Categories';
import CategoryCreate from '@/pages/categories/categoryCreate/CategoryCreate';
import CountryList from '@/pages/countries/Countries';
import CountryCreate from '@/pages/countries/countryCreate/CountryCreate';
// import AddUser from '@/pages/users/userModal/AddUser';
import AdminLayout from '@/layouts/adminLayout/Index';
import AuthLayout from '@/layouts/authLayout/Index';
import Login from '@/pages/auth/Login';
import Dashboard from '@/pages/dashboard/Dashboard';
// import Roles from '@/pages/roles/Roles';
// import AddRole from '@/pages/roles/AddRole';
import Products from '@/pages/products/Products';
import AddProduct from '@/pages/products/AddProduct';
import MediaLibrary from '@/pages/media/mediaList/MediaLibrary';
import MediaDetailsModal from '@/pages/media/mediaList/mediaShow/MediaDetailsModal';
import MovieList from '@/pages/movies/Movies';
import MoviesTable from '@/pages/movies/movieList/MoviesTable';
import MovieCreate from '@/pages/movies/movieCreate/MovieCreate';
import MovieShow from '@/pages/movies/movieList/movieShow/Modal';
import EpisodesManager from '@/pages/movies/episodes/EpisodesManager';
import EpisodeFormModal from '@/pages/movies/episodes/episodeCreate/Modal';
import EpisodeGenerateModal from '@/pages/movies/episodes/episodeGenerate/Modal';
import EpisodeShiftModal from '@/pages/movies/episodes/episodeShift/Modal';
import MovieMedia from '@/pages/movies/movieList/movieMedia/MovieMedia';

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path='/users' element={<PermComponent component={<UserList />} pTitle="view-user" />}>
                    <Route path=':id' element={<PermComponent component={<UserShow />} pTitle="view-user" />} />
                    <Route path=':id/roles' element={<PermComponent component={<UserRoles />} pTitle="sync-role-to-user" />} />
                    <Route path=':id/devices' element={<PermComponent component={<UserDevices />} pTitle="view-device" />} />
                    {/* <Route path='add-user' element={<AddUser />} />
                    <Route path='edit-user/:id' element={<AddUser />} /> */}
                </Route>
                <Route path='/users/trashed' element={<PermComponent component={<UserListTrashed />} pTitle="view-delete-user" />} />
                <Route path='/users/add-user' element={<PermComponent component={<UserCreate />} pTitle="create-user" />} />
                <Route path='/users/edit-user/:id' element={<PermComponent component={<UserCreate />} pTitle="update-user" />} />
                <Route path='/users/roles' element={<PermComponent component={<RoleList />} pTitle="view-role" />} >
                    <Route path=':id' element={<PermComponent component={<RoleShow />} pTitle="view-role" />} />
                    <Route path=':id/permissions' element={<PermComponent component={<RolePermissions />} pTitle="sync-permission-to-role" />} />
                    <Route path='add-role' element={<PermComponent component={<RoleCreate />} pTitle="create-role" />} />
                    <Route path='edit-role/:id' element={<PermComponent component={<RoleCreate />} pTitle="update-role" />} />
                </Route>
                <Route path='/users/permissions' element={<PermComponent component={<PermissionList />} pTitle="view-permission" />} >
                    <Route path='add-permission' element={<PermComponent component={<PermissionCreate />} pTitle="create-permission" />} />
                    <Route path='edit-permission/:id' element={<PermComponent component={<PermissionCreate />} pTitle="update-permission" />} />
                </Route>


                <Route path='/media' element={<PermComponent component={<MediaLibrary />} pTitle="view-media" />} >
                    <Route path=":id" element={<PermComponent component={<MediaDetailsModal />} pTitle="view-media" />}/>
                </Route>
                <Route path='/media/upload' element={<PermComponent component={<MediaLibrary />} pTitle="create-media" />} />
                <Route path='/media/trashed' element={<PermComponent component={<MediaLibrary />} pTitle="view-delete-media" />} >
                 <Route path=":id" element={<PermComponent component={<MediaDetailsModal />} pTitle="view-delete-media" />}/>
                </Route>
                


                <Route path='/categories' element={<PermComponent component={<CategoryList />} pTitle="view-category" />} >
                    <Route path='add-category' element={<PermComponent component={<CategoryCreate />} pTitle="create-category" />} />
                    <Route path='edit-category/:id' element={<PermComponent component={<CategoryCreate />} pTitle="update-category" />} />
                </Route>
                <Route path='/countries' element={<PermComponent component={<CountryList />} pTitle="view-country" />} >
                    <Route path='add-country' element={<PermComponent component={<CountryCreate />} pTitle="create-county" />} />
                    <Route path='edit-country/:id' element={<PermComponent component={<CountryCreate />} pTitle="update-country" />} />
                </Route>

                 <Route path='/movies' element={<PermComponent component={<MovieList />} pTitle="view-movie" />}>
                    {/* <Route index element={<PermComponent component={<MoviesTable />} pTitle="view-movie" />} /> */}
                    <Route path=':id' element={<PermComponent component={<MovieShow />} pTitle="view-movie" />}/>
                </Route>
                <Route path='movies/:id/episodes' element={<PermComponent component={<EpisodesManager />} pTitle="view-episode" />}>
                        <Route path='add-episode' element={<PermComponent component={<EpisodeFormModal />} pTitle="create-episode" />}/>
                        <Route path=':episodeId/edit' element={<PermComponent component={<EpisodeFormModal />} pTitle="update-episode" />}/>
                        <Route path='generate' element={<PermComponent component={<EpisodeGenerateModal />} pTitle="create-episode" />}/>
                        <Route path='shift' element={<PermComponent component={<EpisodeShiftModal />} pTitle="update-episode" />}/>
                </Route>
                <Route path='movies/:id/media' element={<PermComponent component={<MovieMedia />} pTitle="view-movie" />}/>

                <Route path='/movies/add-movie' element={<PermComponent component={<MovieCreate />} pTitle="create-movie" />}/>
                <Route path='/movies/edit-movie/:id' element={<PermComponent component={<MovieCreate />} pTitle="update-movie" />}/>

            </Route>
            <Route path='/auth' element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;
