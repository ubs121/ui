package main

import (
	"io"
	"log"
	"net/http"
	"time"
)

var (
	// global registry for client channels
	clients map[string]chan string = make(map[string]chan string)

	// random data generate interval
	dataPushInterval time.Duration = time.Duration(5) * time.Second // 5 seconds
)

func getdata(w http.ResponseWriter, r *http.Request) {
	uri := r.RequestURI
	log.Printf("getData  %s\n", uri)
	setCORSHeaders(r, w)
	io.WriteString(w, dataForUri(uri))
}

func poll(w http.ResponseWriter, r *http.Request) {
	uri := r.RequestURI
	log.Printf("longPoll  %s\n", uri)

	setCORSHeaders(r, w)

	ch := make(chan string)
	clients[uri] = ch // FIXME: avoid lock

	// set timeout
	timeout := make(chan bool)
	go func() {
		time.Sleep(60e9) // ?
		timeout <- true
	}()

	select {
	case msg := <-ch: // wait for message from the channel
		io.WriteString(w, msg)
	case <-timeout: // received timeout
		log.Printf("Timeout for client %s\n", uri)
		return
	}

	// remove channel
	delete(clients, uri)
}

// push random data
func pushSampleData() {
	ticker := time.NewTicker(dataPushInterval)
	quit := make(chan struct{})
	go func() {
		for {
			select {
			case <-ticker.C:
				// do stuff
				for uri, ch := range clients {
					ch <- dataForUri(uri)
				}
			case <-quit:
				ticker.Stop()
				return
			}
		}
	}()
}

// set CORS headers
func setCORSHeaders(r *http.Request, w http.ResponseWriter) {
	// TODO: copy Access-Control-Request-Headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Methods", "GET")
	w.Header().Add("Access-Control-Allow-Headers", r.Header.Get("Access-Control-Request-Headers"))
}

func main() {
	http.HandleFunc("/longpoll/", poll)
	http.HandleFunc("/getdata/", getdata)

	pushSampleData()

	log.Println("Listen On :8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err.Error())
	}
}
