import React, { useEffect, useState } from 'react';
import { countriesGetService, countryDeleteService } from '@/services/countries';
import PaginatedTable from '@/components/PaginatedTable';
import { NavLink, useNavigate } from 'react-router-dom';
import useServerTable from '@/hooks/useServerTable';
import { createCountryColumns } from './CountryColumns';
import { openConfirmModal, openAlertModal } from '@/components/Modal/modal';
import { useHasPermission } from '@/hooks/useHasPermission';
import { toast } from '@/components/Toast/ToastContainer';
import { useTableRefresh } from '@/hooks/useTableRefresh';
import Tooltip2 from '@/components/Tooltip2';


const CategoriesTable = () => {
    const navigate = useNavigate()
    const [selectedCountries, setSelectedCountries] = useState([]);
    const { registerRefresh, unregisterRefresh } = useTableRefresh();
    const { data, loading, currentPage, setCurrentPage, search, setSearch, pageCount, refresh } = useServerTable({
        service: countriesGetService,
        perPage: 50
    })
    const hasPerm = useHasPermission('create-country');


    useEffect(() => {
        registerRefresh("countries", refresh);

        return () => unregisterRefresh("countries");
    }, []);

    const deleteCountry = async (country) => {
        const confirmed = await openConfirmModal({
            title: "حذف کشور",
            message: `آیا از حذف کشور "${country.name}" مطمئن هستید؟`,
            confirmText: "حذف شود",
            cancelText: "انصراف",
            variant: "danger",
            icon: "trash-bin-minimalistic",
        });
        if (confirmed) {
            try {
                // ✅ صدا زدن سرویس حذف دائمی
                const response = await countryDeleteService(country.id);

                if (response.status === 200 || response.status === 204) {
                    // ✅ نمایش پیام موفقیت
                    // await openAlertModal({
                    //     title: "عملیات موفق",
                    //     message: `کاربر "${user.name}" با موفقیت حذف شد`,
                    //     confirmText: "متوجه شدم",
                    //     variant: "success",
                    //     icon: "check-circle",
                    // });
                    await toast.success(`کشور "${country.name}" با موفقیت حذف شد`, {
                        title: 'موفق',
                        duration: 5000,
                    });

                    // ✅ بارگذاری مجدد دیتا
                    refresh();
                }
            } catch (error) {
                // ✅ مدیریت خطا
                console.error("Error force deleting country:", error);
                // await openAlertModal({
                //     title: "خطا",
                //     message: error.response?.data?.message || "خطا در حذف کاربر",
                //     confirmText: "متوجه شدم",
                //     variant: "danger",
                //     icon: "alert-triangle",
                // });
                await toast.error(error.response?.data?.message || "خطا در حذف کشور", {
                    title: 'خطا',
                    duration: 5000,
                });
            }
        }
    }

    const dataInfo = createCountryColumns({
        onView: (country) => console.log("View:", country),
        // onEdit: (user) => console.log("Edit:", user),
        onDelete: deleteCountry,
        // onDelete: (user) => console.log("Delete:", user),
    })




    const tableSetting = {
        title: 'لیست کشور ها',
        searchPlaceholder: 'جست و جو ...',
        selectable: false,
        countSelect: false,
        loading: loading
    }


    return (

        <>
            <PaginatedTable
                serverSide={true}

                data={data}
                dataInfo={dataInfo}
                currentPage={currentPage}
                pageCount={pageCount}
                onPageChange={setCurrentPage}
                searchValue={search}
                onSearch={setSearch}
                selectedRows={selectedCountries}
                setSelectedRows={setSelectedCountries}
                tableSetting={tableSetting}
            >
                {hasPerm &&
                    <Tooltip2 text='افزودن' placement='top'>
                        <NavLink
                            to={'/countries/add-country'}
                            className="flex justify-center items-center p-1.5 gap-1 bg-blue-50 hover:bg-blue-100 text-custom-blue border-[1.4px] border-custom-blue text-[18px] rounded-md transition cursor-pointer"
                        >
                            <svg className="w-22px h-22px fill-transparent">
                                <use xlinkHref="#icon-plus"></use>
                            </svg>
                        </NavLink>
                    </Tooltip2>
                }
            </PaginatedTable>
        </>
    );
}

export default CategoriesTable;
