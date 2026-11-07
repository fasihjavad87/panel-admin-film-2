// components/Pagination.jsx
const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    paginationInfo,
    showCountPage
}) => {
    const pageRange = 3;

    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i < currentPage + pageRange && i > currentPage - pageRange) {
                pages.push(i);
            }
        }
        return pages;
    };

    return (
        <div className={`flex ${showCountPage ? 'justify-between' : 'justify-end'}  items-center mt-4 pt-3 border-t border-gray-200 select-none1`}>
            {showCountPage && (
                <div className="text-sm text-gray-500">
                    نمایش {paginationInfo.start} تا {paginationInfo.end} از {paginationInfo.total} کاربر
                </div>
            )}

            <nav aria-label="Page navigation" dir="ltr" className="flex gap-1">
                <button
                    className={`flex items-center justify-center w-9 h-9 rounded-md border transition cursor-pointer ${currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-custom-blue border-gray-300 hover:bg-blue-50'
                        }`}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <svg className="w-[22px] h-[22px] fill-transparent">
                        <use xlinkHref="#icon-alt-arrow-left"></use>
                    </svg>
                </button>

                {currentPage > pageRange && (
                    <button
                        className="w-9 h-9 rounded-md border bg-white text-gray-700 border-gray-300 hover:bg-blue-50 transition cursor-pointer"
                        onClick={() => onPageChange(1)}
                    >
                        1
                    </button>
                )}

                {getVisiblePages().map((page) => (
                    <button
                        key={page}
                        className={`w-9 h-9 rounded-md border transition cursor-pointer ${currentPage === page
                            ? 'bg-custom-blue text-white border-custom-blue'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
                            }`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                ))}

                {currentPage <= totalPages - pageRange && (
                    <button
                        className="w-9 h-9 rounded-md border bg-white text-gray-700 border-gray-300 hover:bg-blue-50 transition cursor-pointer"
                        onClick={() => onPageChange(totalPages)}
                    >
                        {totalPages}
                    </button>
                )}

                <button
                    className={`flex items-center justify-center w-9 h-9 rounded-md border transition cursor-pointer ${currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-custom-blue border-gray-300 hover:bg-blue-50'
                        }`}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <svg className="w-[22px] h-[22px] fill-transparent">
                        <use xlinkHref="#icon-alt-arrow-right"></use>
                    </svg>
                </button>
            </nav>
        </div>
    );
};

export default Pagination;