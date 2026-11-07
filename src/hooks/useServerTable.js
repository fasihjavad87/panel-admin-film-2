// import { useEffect, useState } from "react";
// import useDebounce from "./useDebounce";

// export default function useServerTable({ service, perPage = 10 }) {
//   const [data, setData] = useState([]);

//   const [loading, setLoading] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);

//   const [pageCount, setPageCount] = useState(0);

//   const [stablePageCount, setStablePageCount] = useState(0);

//   const [search, setSearch] = useState("");

//   const debouncedSearch = useDebounce(search, 1000);

//   const [paginationInfo, setPaginationInfo] = useState({
//     start: 0,
//     end: 0,
//     total: 0,
//   });

//   const fetchData = async () => {
//     try {
//       setLoading(true);
      

//       const res = await service(currentPage, perPage, debouncedSearch);
// console.log(res);

//       const result = res.data.data;

//       setData(result.data);

//       setPageCount(result.last_page);

//       setPaginationInfo({
//         start: result.from,
//         end: result.to,
//         total: result.total,
//       });
//     } catch (error) {
//       // console.error(error);
//       console.log('error-server-table');
      
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refresh = () => {
//     fetchData();
//   };

//   useEffect(() => {
//     fetchData();
//   }, [currentPage, perPage, debouncedSearch]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [debouncedSearch]);

//   useEffect(() => {
//     if (!loading) {
//       setStablePageCount(pageCount);
//     }
//   }, [pageCount, loading]);

//   return {
//     data,

//     loading,

//     currentPage,
//     setCurrentPage,

//     search,
//     setSearch,

//     pageCount: stablePageCount,

//     paginationInfo,

//     refresh,
//   };
// }



// import { useEffect, useState } from "react";
// import useDebounce from "./useDebounce";

// /**
//  * useServerTable — جدول با داده از سرور
//  *
//  * @param {Object} options
//  * @param {Function} options.service       تابع سرویس (page, perPage, search) => Promise
//  * @param {number}   options.perPage       تعداد در صفحه (پیش‌فرض 10)
//  * @param {boolean}  options.paginated     آیا خروجی Laravel paginate() هست؟
//  *                                          false (پیش‌فرض) = بدون pagination
//  *                                          true = با pagination (last_page, from, to, total)
//  * @param {boolean}  options.initialLoad   آیا در mount اولیه fetch کنه؟ (پیش‌فرض true)
//  */
// export default function useServerTable({
//   service,
//   perPage = 10,
//   paginated = false,       // ⬅️ پیش‌فرض: بدون pagination
//   initialLoad = true,
// }) {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageCount, setPageCount] = useState(0);
//   const [stablePageCount, setStablePageCount] = useState(0);
//   const [search, setSearch] = useState("");
//   const debouncedSearch = useDebounce(search, 1000);

//   const [paginationInfo, setPaginationInfo] = useState({
//     start: 0,
//     end: 0,
//     total: 0,
//   });

//   // ==================== استخراج داده از response ====================
//   const extractData = (res) => {
//     const responseData = res?.data;

//     if (paginated) {
//       // حالت pagination: Laravel paginate()
//       // { current_page, data: [...], last_page, from, to, total, ... }
//       const items = Array.isArray(responseData?.data) ? responseData.data : [];
//       return {
//         items,
//         lastPage: responseData?.last_page ?? 0,
//         from: responseData?.from ?? 0,
//         to: responseData?.to ?? 0,
//         total: responseData?.total ?? 0,
//       };
//     }

//     // ==================== حالت بدون pagination ====================
//     // چند حالت ممکنه:
//     // 1. res.data = [...] (آرایه مستقیم)
//     // 2. res.data = { data: [...] } (بدون last_page)
//     // 3. res.data = { data: { data: [...], last_page, ... } } (ساختار قدیمی users)

//     // حالت 3: ساختار قدیمی users (data.data)
//     if (responseData?.data && Array.isArray(responseData.data?.data)) {
//       const old = responseData.data;
//       return {
//         items: old.data || [],
//         lastPage: old.last_page ?? 1,
//         from: old.from ?? 0,
//         to: old.to ?? 0,
//         total: old.total ?? 0,
//       };
//     }

//     // حالت 2: { data: [...] }
//     if (Array.isArray(responseData?.data)) {
//       return {
//         items: responseData.data,
//         lastPage: 1,
//         from: 1,
//         to: responseData.data.length,
//         total: responseData.data.length,
//       };
//     }

//     // حالت 1: آرایه مستقیم
//     if (Array.isArray(responseData)) {
//       return {
//         items: responseData,
//         lastPage: 1,
//         from: 1,
//         to: responseData.length,
//         total: responseData.length,
//       };
//     }

//     // هیچ‌کدوم → خالی
//     return { items: [], lastPage: 0, from: 0, to: 0, total: 0 };
//   };

//   // ==================== fetchData ====================
//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       const res = await service(currentPage, perPage, debouncedSearch);

//       const { items, lastPage, from, to, total } = extractData(res);
//       console.log(res);
      

//       setData(items || []);
//       setPageCount(lastPage || 0);
//       setPaginationInfo({
//         start: from || 0,
//         end: to || 0,
//         total: total || 0,
//       });
//     } catch (error) {
//       console.log("error-server-table");
//       setData([]);
//       setPageCount(0);
//       setPaginationInfo({ start: 0, end: 0, total: 0 });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refresh = () => {
//     fetchData();
//   };

//   // ==================== Effects ====================
//   useEffect(() => {
//     if (initialLoad) {
//       fetchData();
//     }
//   }, [currentPage, perPage, debouncedSearch]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [debouncedSearch]);

//   useEffect(() => {
//     if (!loading) {
//       setStablePageCount(pageCount);
//     }
//   }, [pageCount, loading]);

//   return {
//     data,
//     loading,
//     currentPage,
//     setCurrentPage,
//     search,
//     setSearch,
//     pageCount: stablePageCount,
//     paginationInfo,
//     refresh,
//   };
// }



import { useEffect, useState } from "react";
import useDebounce from "./useDebounce";

export default function useServerTable({
  service,
  perPage = 10,
  paginated = false,
  initialLoad = true,
  deps = [],   // ⬅️ جدید
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [stablePageCount, setStablePageCount] = useState(0);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);

  const [paginationInfo, setPaginationInfo] = useState({
    start: 0,
    end: 0,
    total: 0,
  });

  // ⬇️⬇️⬇️ depsKey برای dependency array ⬇️⬇️⬇️
  const depsKey = JSON.stringify(deps);

  const extractData = (res) => {
    const responseData = res?.data;

    if (paginated) {
      const items = Array.isArray(responseData?.data) ? responseData.data : [];
      return {
        items,
        lastPage: responseData?.last_page ?? 0,
        from: responseData?.from ?? 0,
        to: responseData?.to ?? 0,
        total: responseData?.total ?? 0,
      };
    }

    if (responseData?.data && Array.isArray(responseData.data?.data)) {
      const old = responseData.data;
      return {
        items: old.data || [],
        lastPage: old.last_page ?? 1,
        from: old.from ?? 0,
        to: old.to ?? 0,
        total: old.total ?? 0,
      };
    }

    if (Array.isArray(responseData?.data)) {
      return {
        items: responseData.data,
        lastPage: 1,
        from: 1,
        to: responseData.data.length,
        total: responseData.data.length,
      };
    }

    if (Array.isArray(responseData)) {
      return {
        items: responseData,
        lastPage: 1,
        from: 1,
        to: responseData.length,
        total: responseData.length,
      };
    }

    return { items: [], lastPage: 0, from: 0, to: 0, total: 0 };
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await service(currentPage, perPage, debouncedSearch);

      const { items, lastPage, from, to, total } = extractData(res);

      setData(items || []);
      setPageCount(lastPage || 0);
      setPaginationInfo({
        start: from || 0,
        end: to || 0,
        total: total || 0,
      });
    } catch (error) {
      console.log("error-server-table");
      setData([]);
      setPageCount(0);
      setPaginationInfo({ start: 0, end: 0, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    fetchData();
  };

  useEffect(() => {
    if (initialLoad) {
      fetchData();
    }
  }, [currentPage, perPage, debouncedSearch, depsKey]);   // ⬅️ depsKey اضافه شد

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // ⬇️⬇️⬇️ جدید: وقتی depsKey عوض شد، به صفحه 1 برگرد ⬇️⬇️⬇️
  useEffect(() => {
    setCurrentPage(1);
  }, [depsKey]);

  useEffect(() => {
    if (!loading) {
      setStablePageCount(pageCount);
    }
  }, [pageCount, loading]);

  return {
    data,
    loading,
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    pageCount: stablePageCount,
    paginationInfo,
    refresh,
  };
}