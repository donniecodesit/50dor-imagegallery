import { FaSearch } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import Photo from "./Photo/Photo";

const clientID=`?client_id=${process.env.REACT_APP_API_KEY}`
const mainUrl="https://api.unsplash.com/photos/"
const searchUrl="https://api.unsplash.com/search/photos"

function App() {
  // States required: Loading, Photos, Page, Query
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(false);

  const fetchImages = async() => {
    setLoading(true);
    setError(false);
    let url;
    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${query}`;

    if (query) url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
    else url = `${mainUrl}${clientID}${urlPage}`;

    try {
      const response = await fetch(url);
      if (response.status === 403) throw("API Service Returned 403")
      const data = await response.json();
      setPhotos((oldPhoto) => {
        if (query && page === 1) return data.results;
        else if (query) return [...oldPhoto, ...data.results];
        else return [...oldPhoto, ...data];
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(true);
      console.log(err);
    }
  }

  useEffect(() => {
    fetchImages();
  }, [page])

  useEffect(() => {
    const event = window.addEventListener("scroll", () => {
      if ((!loading && window.innerHeight + window.scrollY) >= document.body.scrollHeight - 2) {
        setPage((oldPage) => {
          return oldPage + 1;
        })
      }
    })
    return () => window.removeEventListener("scroll", event);
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    fetchImages();
  }

  return (
    <main>
      <section className="search">
        <form className="search-form">
          <input type="text" placeholder="search" className="form-input" value={query} onChange={({target}) => setQuery(target.value)}/>
          <button type="submit" className="submit-btn" onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
        {
          error && 
          <div className="error">
            <p>Invalid Search, or Search returned 403</p>
          </div>
        }
      </section>
      <section className="photos">
        <div className="photos-center">
          {
            photos.map((image, index) => {
              return <Photo key={index} {...image}/>
            })
          }
        </div>
      </section>
    </main>
  );
}

export default App;
