import React from 'react';
import MediaLibrary from './mediaList/MediaLibrary';
import { Outlet } from 'react-router-dom';

const Media = () => {
    return (
        <div>
            {/* <MediaLibrary/> */}
            <Outlet/>
        </div>
    );
}

export default Media;
