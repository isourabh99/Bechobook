
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../Authentication/AuthContext";
// import Swal from "sweetalert2";
// import Header from "../Header/Header";
// import Nav from "../Header/Nav";
// import Footer from "../Footer/Footer";
// import { useNavigate } from "react-router-dom";
// const CheckList = () => {
//   const [books, setBooks] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [filteredBooks, setFilteredBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isSortOpen, setIsSortOpen] = useState(false);
//   const [selectedFilters, setSelectedFilters] = useState({});
//   const [sortBy, setSortBy] = useState("Select");
//   const [allCategories, setAllCategories] = useState([]);

//   const [isOpen, setIsOpen] = useState(false);
//   const { authToken } = useAuth();
//   const navigate = useNavigate();
//   const fetchBooks = async (page = 1) => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         "https://bb.bechobookscan.com/api/premium-brochure-books",
//         { params: { page } }
//       );

//       const { data, pagination, total_price } = response.data;
//       setBooks(data);
//       setFilteredBooks(data); // Initialize filteredBooks with the fetched data
//       setTotalPrice(total_price || 0);
//       setCurrentPage(pagination.current_page);
//       setTotalPages(pagination.last_page);
//     } catch (error) {
//       console.error("Error fetching books:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBooks(currentPage);
//   }, [currentPage]);

//   useEffect(() => {
//     applyFiltersAndSorting();
//   }, [books, selectedFilters, sortBy]);

//   const applyFiltersAndSorting = () => {
//     let updatedBooks = [...books];

//     // Apply filters
//     const activeFilters = Object.keys(selectedFilters).filter(
//       (key) => selectedFilters[key]
//     );

//     if (activeFilters.length > 0) {
//       updatedBooks = updatedBooks.filter((book) =>
//         activeFilters.includes(book.category?.name || "")
//       );
//     }

//     // Apply sorting
//     if (sortBy === "Low to High") {
//       updatedBooks.sort((a, b) => (a.price || 0) - (b.price || 0));
//     } else if (sortBy === "High to Low") {
//       updatedBooks.sort((a, b) => (b.price || 0) - (a.price || 0));
//     }

//     setFilteredBooks(updatedBooks);
//   };

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const categories = [
//     ...new Set(books.map((bookItem) => bookItem.category?.name).filter(Boolean)),
//   ];

//   const handleToggle = () => {
//     setIsOpen((prev) => !prev);
//   };

//   const toggleCheckbox = (category) => {
//     setSelectedFilters((prevFilters) => ({
//       ...prevFilters,
//       [category]: !prevFilters[category],
//     }));
//   };

//   const handleSortSelection = (option) => {
//     setSortBy(option);
//     setIsSortOpen(false);
//   };

//   const handleToggleSort = () => {
//     setIsSortOpen(!isSortOpen);
//   };

//   const handleContactUs = async () => {
//     if (!authToken) {
//       Swal.fire("Error", "You are not authenticated. Please log in.", "error");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "https://bb.bechobookscan.com/api/createQuotation",
//         {
//           brochure_type: "premium",
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       );
//       Swal.fire({
//                 icon: "success",
//                 title: "Order Placed!",
//                 text: "Your order has been placed successfully. Redirecting to call...",
//                 confirmButtonColor: "#28a745",
//               }).then(() => {
//         // Redirect to the phone dialer with a specific phone number
       
//         window.location.href = "tel:+91 79877 89150"; // Change this to the actual phone number
//         // navigate("/")
//       });
//     } catch (error) {
//       console.error("Error creating order:", error);
//       const errorMessage =
//         error.response?.data?.message || "Something went wrong. Please try again.";
//       Swal.fire("Error", errorMessage, "error");
//     }
//   };
//   const formatArrayOrString = (data) => {
//     if (Array.isArray(data)) {
//       return data.join(", ");
//     } else if (typeof data === "string") {
//       return data;
//     }
//     return "Unknown";
//   };
//   return (
//     <>
//       <Header />
//       <Nav />
//       <div className="w-full bg-gray-100 h-auto md:h-[100px] flex flex-col md:flex-row justify-between items-center px-4 md:px-12 py-2 md:py-0">
//         {/* Total Sum Section */}
//         <div className="text-center md:text-left mb-2 md:mb-0">
//           <h2 className="text-base md:text-lg font-semibold text-gray-700">
//             Total sum of books: <span className="text-blue-600"> ₹{totalPrice}</span>
//           </h2>
//         </div>

//         {/* Filter & Sort Section */}
//         <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
//           {/* Filter Dropdown */}
//           <div className="relative w-full sm:w-48">
//             <div
//               className="flex justify-between items-center cursor-pointer bg-white border rounded px-4 py-2"
//               onClick={handleToggle}
//             >
//               <span className="font-semibold text-gray-700">Filter by type</span>
//               <span className="text-gray-600 text-sm ml-2">
//                 {isOpen ? "▼" : "▲"}
//               </span>
//             </div>

//             {isOpen && (
//               <div className="absolute left-0 top-full w-full bg-white border rounded shadow-md z-10">
//                 <div className="space-y-2 p-4">
//                   {categories.map((category) => (
//                     <label
//                       key={category}
//                       className="flex items-center space-x-2 cursor-pointer"
//                     >
//                       <input
//                         type="checkbox"
//                         checked={selectedFilters[category] || false}
//                         onChange={() => toggleCheckbox(category)}
//                         className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                       />
//                       <span className="text-gray-700 capitalize">{category}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Sort Dropdown */}
//           <div className="relative w-full sm:w-48">
//             <div
//               className="flex justify-between items-center cursor-pointer bg-white border rounded px-4 py-2 shadow"
//               onClick={handleToggleSort}
//             >
//               <span className="font-semibold text-gray-700">
//                 Sort By : <span className="text-black font-bold">{sortBy}</span>
//               </span>
//               <span className="text-gray-600 text-sm ml-2">
//                 {isSortOpen ? "▼" : "▲"}
//               </span>
//             </div>

//             {isSortOpen && (
//               <div className="absolute right-0 mt-2 w-full bg-white border rounded shadow-md z-10">
//                 <div className="space-y-2 p-2">
//                   <div
//                     className={`cursor-pointer px-2 py-1 rounded ${sortBy === "Select"
//                         ? "bg-blue-100 text-blue-700 font-bold"
//                         : "text-gray-700 hover:bg-gray-200"
//                       }`}
//                     onClick={() => handleSortSelection("Select")}
//                   >
//                     Select
//                   </div>
//                   {["Low to High", "High to Low"].map((option, index) => (
//                     <div
//                       key={index}
//                       className={`cursor-pointer px-2 py-1 rounded ${sortBy === option
//                           ? "bg-blue-100 text-blue-700 font-bold"
//                           : "text-gray-700 hover:bg-gray-200"
//                         }`}
//                       onClick={() => handleSortSelection(option)}
//                     >
//                       {option}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {filteredBooks.length === 0 ? (
//         <p>No books available</p>
//       ) : (
//         <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 p-8">
//           {filteredBooks.map((bookItem) => {
//             const { book, price, mrp } = bookItem;
//             const bookImage = book?.image || "placeholder.jpg";
//             const bookTitle = book?.title_long || "Unknown Title";
//             // const bookAuthor = (book?.authors || []).join(", ") || "Unknown Author";
//             const bookAuthor = formatArrayOrString(book?.authors); // Handle both array and string
//             return (
//               <div
//                 key={book.isbn13}
//                 className="bg-white border border-gray-200 shadow-lg rounded-lg p-2 flex flex-col items-center transition-transform transform hover:scale-105 w-full sm:w-48"
//                 onClick={() => navigate(`/book/${book.isbn13}`, { state: { hideActions: true } })}
//               >
//                 <img
//                   src={bookImage}
//                   alt={bookTitle}
//                   className="w-full h-40 object-contain mb-2 rounded"
//                 />
//                 <h2 className="text-sm sm:text-lg font-semibold text-gray-800 text-center mb-1">
//                   {bookTitle}
//                 </h2>
//                 <p className="text-xs sm:text-sm text-gray-600 text-center mb-1">
//                   {bookAuthor}
//                 </p>
//                 <div className="flex items-center justify-center mt-1">
//                   <span className="text-base sm:text-lg font-bold text-green-600">
//                     ₹{price || "N/A"}
//                   </span>
//                   <span className="text-xs sm:text-sm text-orange-400 line-through ml-2">
//                     ₹{mrp || "N/A"}
//                   </span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Pagination */}
//       <div className="flex justify-center mt-4 space-x-2">
//         <button
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
//         >
//           Prev
//         </button>
//         <span className="text-lg font-semibold">
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>

//       {/* Summary */}
//       <div className="max-w-sm mx-auto p-6 bg-white shadow-md rounded-md mt-6">
//         <div className="flex justify-between py-2 border-b">
//           <span className="text-gray-700">Subtotal</span>
//           {/* <span className="text-gray-700">₹{totalPrice}</span> */}
//           <span className="text-gray-700">₹{parseFloat(totalPrice).toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between py-2 border-b mt-2">
//           <span className="text-gray-700">Total</span>
//           {/* <span className="text-gray-700">₹{totalPrice}</span> */}
//           <span className="text-gray-700">₹{parseFloat(totalPrice).toFixed(2)}</span>
//         </div>
//         <button
//           onClick={handleContactUs}
//           className="mt-4 w-full bg-orange-500 text-white py-2 rounded-md transition duration-300"
//         >
//           Proceed to Checkout
//         </button>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default CheckList;

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Authentication/AuthContext";
import Swal from "sweetalert2";
import Header from "../Header/Header";
import Nav from "../Header/Nav";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import Pagination from "../Pagination/Pagination";
import { HashLoader } from "react-spinners";
import { Base_url } from "../ApiController/ApiController";
import bookError  from '../../assets/bookError.png'
const CheckList = () => {
  const [books, setBooks] = useState([]); // All books fetched from the API
  const [filteredBooks, setFilteredBooks] = useState([]); // Books after applying filters and sorting
  const [displayedBooks, setDisplayedBooks] = useState([]); // Books displayed on the current page
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [sortBy, setSortBy] = useState("Select");
  const [isOpen, setIsOpen] = useState(false);
  const { authToken } = useAuth();
  const navigate = useNavigate();
  const [categories,setCategories] =  useState([]);


  // Fetch all books from the API
  const fetchAllBooks = async () => {
    try {
      setLoading(true);

          console.log("====",selectedFilters);
         const response = await axios.get(
          Base_url+"premium-brochure-books",
          { params: { page: currentPage,category_names:selectedFilters,sort:sortBy } }
        );
      
          console.log(response.data)
      setBooks(response.data.data);
      setFilteredBooks(response.data.data); // Initialize filteredBooks with all fetched data
      setTotalPages(response.data.pagination.last_page); // Calculate total pages based on itemsPerPage
      setTotalPrice(response.data.total_price); // Calculate total pages based on itemsPerPage
      setCategories(response.data.category_in_book);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBooks();
  }, [currentPage,selectedFilters,sortBy]);

  // Apply filters and sorting whenever books, selectedFilters, or sortBy changes
  // useEffect(() => {
  //   applyFiltersAndSorting();
  // }, [books, selectedFilters, sortBy]);

  // Apply filters and sorting to the entire dataset
  // const applyFiltersAndSorting = () => {
  //   let updatedBooks = [...books];

  //   // Apply filters
  //   const activeFilters = Object.keys(selectedFilters).filter(
  //     (key) => selectedFilters[key]
  //   );

  //   if (activeFilters.length > 0) {
  //     updatedBooks = updatedBooks.filter((book) =>
  //       activeFilters.includes(book.category?.name || "")
  //     );
  //   }

  //   // Apply sorting
  //   if (sortBy === "Low to High") {
  //     updatedBooks.sort((a, b) => (a.price || 0) - (b.price || 0));
  //   } else if (sortBy === "High to Low") {
  //     updatedBooks.sort((a, b) => (b.price || 0) - (a.price || 0));
  //   }

  //   // setFilteredBooks(updatedBooks);
  //   // setTotalPages(Math.ceil(updatedBooks.length / itemsPerPage)); // Update total pages based on filtered books
  //   // setCurrentPage(1); // Reset to the first page after applying filters
  // };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Toggle filter dropdown
  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  // Toggle checkbox for filters
  const toggleCheckbox = (category) => {
    setSelectedFilters((prevFilters) => prevFilters.includes(category) ? prevFilters.filter((c)=> c != category) :
      [...prevFilters , category]);
      setIsOpen(false);
      setCurrentPage(1)
  };

  // Handle sort selection
  const handleSortSelection = (option) => {
    setSortBy(option);
    setIsSortOpen(false);
  };

  // Toggle sort dropdown
  const handleToggleSort = () => {
    setIsSortOpen(!isSortOpen);
  };

  // Handle contact us (checkout)
  const handleContactUs = async () => {
    if (!authToken) {
      Swal.fire({
             icon: "error",
             text: "Please Log in first!",
           }).then((result) => {
             if (result.isConfirmed) {
               navigate('/login');
             }
           });
      return;
    }

    try {
      const response = await axios.post(
        Base_url+"createQuotation",
        {
          brochure_type: "premium",
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Order Placed!",
        text: "Your order has been placed successfully. Redirecting to call...",
        confirmButtonColor: "#28a745",
      }).then(() => {
        // Redirect to the phone dialer with a specific phone number
        window.location.href = "tel:+91 79877 89150"; // Change this to the actual phone number
      });
    } catch (error) {
      console.error("Error creating order:", error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong. Please try again.";
      Swal.fire("Error", errorMessage, "error");
    }
  };

  // Format array or string for authors
  const formatArrayOrString = (data) => {
    if (Array.isArray(data)) {
      return data.join(", ");
    } else if (typeof data === "string") {
      return data;
    }
    return "Unknown";
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <HashLoader color="#4A90E2" size={80} />
      </div>
    );
  }
  return (
    <>
      <Header />
      <Nav />
      <div className="w-full bg-gray-100 h-auto md:h-[100px] flex flex-col md:flex-row justify-between items-center px-4 md:px-12 py-2 md:py-0">
        {/* Total Sum Section */}
        <div className="text-center md:text-left mb-2 md:mb-0">
          <h2 className="text-base md:text-lg font-semibold text-gray-700">
            Total sum of books: <span className="text-blue-600"> ₹{totalPrice}</span>
          </h2>
        </div>

        {/* Filter & Sort Section */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Filter Dropdown */}
          <div className="relative w-full sm:w-48">
            <div
              className="flex justify-between items-center cursor-pointer bg-white border rounded px-4 py-2"
              onClick={handleToggle}
            >
              <span className="font-semibold text-gray-700">Filter by type</span>
              <span className="text-gray-600 text-sm ml-2">
                {isOpen ? "▼" : "▲"}
              </span>
            </div>

            {isOpen && (
              <div className="absolute left-0 top-full w-full bg-white border rounded shadow-md z-10">
                <div className="space-y-2 p-4">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFilters.includes(category)}
                        onChange={() => toggleCheckbox(category)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700 capitalize">{category.length > 16 ? category.substring(0,15) +'...' : category}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative w-full sm:w-48">
            <div
              className="flex justify-between items-center cursor-pointer bg-white border rounded px-4 py-2 shadow"
              onClick={handleToggleSort}
            >
              <span className="font-semibold text-gray-700">
                Sort By : <span className="text-black font-bold">{sortBy === 'low_to_high' ? 'Low To High' : sortBy === 'high_to_low'?'High To Low' : 'Select'}</span>
              </span>
              <span className="text-gray-600 text-sm ml-2">
                {isSortOpen ? "▼" : "▲"}
              </span>
            </div>

            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-full bg-white border rounded shadow-md z-10">
                <div className="space-y-2 p-2">
                  <div
                    className={`cursor-pointer px-2 py-1 rounded ${
                      sortBy === "Select"
                        ? "bg-blue-100 text-blue-700 font-bold"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => handleSortSelection("Select")}
                  >
                    Select
                  </div>
                  {["low_to_high", "high_to_low"].map((option, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer px-2 py-1 rounded ${
                        sortBy === option
                          ? "bg-blue-100 text-blue-700 font-bold"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => handleSortSelection(option)}
                    >
                    {option === 'low_to_high' ? 'Low To High' : 'High To Low'}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {books.length === 0 ? (
        <p>No books available</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 p-8">
          {books.map((bookItem) => {
            const { book, price, mrp } = bookItem;
            const bookImage = book?.image || bookError;
            const bookTitle = book?.title_long || "Unknown Title";
            const bookAuthor = formatArrayOrString(book?.authors);
            return (
              <div
                key={book.isbn13}
                className="bg-white border border-gray-200 shadow-lg rounded-lg p-2 flex flex-col items-center transition-transform transform hover:scale-105 w-full sm:w-48"
                onClick={() => navigate(`/book/${book.isbn13}`, { state: { hideActions: true } })}
              >
                <img
                  src={bookImage}
                  alt={bookTitle}
                  className="w-full h-40 object-contain mb-2 rounded"
                />
                <h2 className="text-sm sm:text-lg font-semibold text-gray-800 text-center mb-1">
                  {bookTitle}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 text-center mb-1">
                  {bookAuthor}
                </p>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-base sm:text-lg font-bold text-green-600">
                    ₹{price || "N/A"}
                  </span>
                  <span className="text-xs sm:text-sm text-orange-400 line-through ml-2">
                    ₹{mrp || "N/A"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        {/* <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-lg font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button> */}
        <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        goToPage={handlePageChange}
        />
      </div>

      {/* Summary */}
      <div className="max-w-sm mx-auto p-6 bg-white shadow-md rounded-md mt-6">
        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-700">Subtotal</span>
          <span className="text-gray-700">₹{parseFloat(totalPrice).toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-2 border-b mt-2">
          <span className="text-gray-700">Total</span>
          <span className="text-gray-700">₹{parseFloat(totalPrice).toFixed(2)}</span>
        </div>
        <button
          onClick={handleContactUs}
          className="mt-4 w-full bg-black text-white py-2 rounded-md transition duration-300"
        >
          Proceed to Checkout
        </button>
      </div>
      <Footer />
    </>
  );
};

export default CheckList;