# The Weather Application

- Repository: `weather-app`
- Type of Challenge: `Learning`
- Duration: `5 days`
- Deployment strategy: `Github pages / Netlify`
- Team challenge : `solo`

## Mission objectives

In this challenge you will use and consolidate your knowledge on:

- A typical AJAX flow: send asynchronous requests to a remote server and process the results
- DOM manipulation: changing the DOM based on the results of the AJAX-like requests
- Learn to aggregate and parse data fetched from an API


## The Mission

You have been sent abroad for a 10-month work mission. Your family and friends back home ask you about the weather where you live ALL. THE. TIME.  
Enough is enough, you decide to build a small web application for them so that you can free your time to talk about more interesting topics.

### Specifications

One of the more interesting features in JavaScript is to be able to get information from somewhere else.

A typical flow that is used to get outside data, is to make a **request** to a certain location (url).

This location will then compile the data based on the request sent, and send back a **response** to the origin of the request.

This flow is often used when communicating with **RESTfull API's** (REST = when the architecture/url defines what the response should be)

### AJAX vs Fetch API
Both Ajax (not the football club) and the Fetch API have a very similar flow:

- **request**: the client* asking for a piece of information
- **service**: implements security measures if any, then it compiles the data you request
- **response**: after the service is done, it will send back a response to the client

> *Client: The browser/website that makes the request.

> Only the request and the response happen in the frontend, the service is actually happening somewhere else in the backend of that API.

But what is the difference?

#### Fetch
**Fetch** is considered a more modern way of making requests and receiving responses. It includes methods that are very popular and easy to use (like promises, asynchronous requests, error handling)

```js
fetch('https://example.com/api/users')
  .then(response => response.json())
  .then(users => {
    // Do something with the users data
  })
  .catch(error => {
    // Handle the error
  });
```

#### Ajax XMLHttpRequests
**Ajax** uses the XMLHttpRequest object. It can have it's advantages but is generally thought of as more work to write. It does give you more flexibility in how you want to handle header information (request/response information)

```js
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://example.com/api/users');
xhr.send();

xhr.onload = function() {
  if (xhr.status === 200) {
    // Do something with the users data
  } else {
    // Handle the error
  }
};
```

### Asynchronous Requests

One problem you can often encounter when making an api call using either fetch, Ajax, or anything else that would get the data from somewhere else, is that it may take some time to get it and send it back to the client.

So when a requests takes some time, it slows down the rest of the process as well.

In order to avoid this, we make use of **asynchronous requests** where the request is "set aside while the rest can continue running" while still being processed.

This is important because it allows the user interface to remain responsive even while long-running operations are being performed.

Two main ways:
- **Callbacks**: Callbacks are functions that are passed as arguments to other functions. When the other function completes its task, it calls the callback function with the results.
- **Promises**: Promises are objects that represent the eventual completion (or failure) of an asynchronous operation. When a promise is resolved, it returns a value. When a promise is rejected, it returns an error.

### 🌱 Must haves

- In the home page the user can enter the city of his/her choice (think of the right HTML elements here)
- On clicking the SUBMIT button or pressing ENTER:
    - Use an api to define the city geo-location data from the user-input
    - Use an api to get the weather data for at least the next 5 days
    - Manipulate your DOM in order to display the weather for the next 5 days in your application.
- Find a way to make those API calls asynchronous.
- The application must be responsive, accessible and mobile friendly

> 💡 Not sure where to start? Split this features into multiple smaller todos (in your code, sketch, ...)

### 🌼 Nice to haves (in no specific order)

- Display a line graph of temperature over time using a library such as [Chart.js](https://www.chartjs.org)
- Remember the user choice on subsequent visits
- Allow the user to compare the weather in two cities
- Use the API of https://unsplash.com/ to show a photo of the city they entered in the form

### Resources

- Get the geo-location from the city with an API ([Open-Meteo geo-location](https://open-meteo.com/en/docs/geocoding-api) has the option to do so, but feel free to use other api's)
- Then use the geo-coordinates to get the weather data from the [Open-Meteo Weather API](https://open-meteo.com/en/docs) by using the native JS [`fetch()`](https://devdocs.io/dom/fetch_api/using_fetch) method (if you like, you can also check out [axios](https://github.com/axios/axios))

## _“When the ass begins to bray, surely rain will come that day.”_ (Good luck!)

![](./assets/american-storm.gif)
