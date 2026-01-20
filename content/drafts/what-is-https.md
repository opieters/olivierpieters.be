---
layout: post
title: What is HTTPS?
draft: true
---

tldr; HTTPS secures the connection between two entities over the internet (read: your computer and the server).

Given [recent changes in the Google search result ranking algorithm][google https] to reflect the usage of HTTPS in place of HTTP, it might be useful to highlight why HTTPS matters, what it aims to achieve and what is does certainly not do. I will give a high level overview, so some details are omitted here and there.

## What is HTTPS and how does it relate to HTTP?

The first thing we need to discuss is HTTP, since it is the unsecured equivalent of HTTPS. HTTP stands for Hyper Text Transfer Protocol. Basically, it defines how you request web pages on a server and how the interaction between you (the client) and the server occurs. HTTPS is HTTP over TLS. The _S_ denotes that the connection is secure.

So, what is TLS now? TLS stands for Transport Layer Security. This provides the necessary security needed to transfer data over the (highly insecure) internet between two entities. In essence, it provides the security aspect for HTTPS.

Now that we have a clear overview of the different aspects of HTTPS, let's go a bit deeper and have a look at what exactly is secured by HTTPS and what is not.

## HTTPS: HTTP on Top of TLS

To get a clear overview of how HTTP(S) and TLS are related, have a look at the following figure:

<figure class="centre-element">
![Axes example image](/images/latex/https_image.png){:.max-400px-wide}
</figure>


{{/*
\tikzset{
    block/.style = {draw, fill=white, rectangle, minimum height=3em, minimum width=4em},
}
\begin{tikzpicture}
\node[block] (HTTP) {HTTP};
\node[block, below of=HTTP] (TLS) {TLS};
\node[block, below of=TLS] (TCP) {TCP};
\node[block, below of=TCP] (IP) {IP};
\node[block, below of=IP] (MAC) {MAC};
\node[block, below of=MAC] (PHY) {PHY};
\node[left of=HTTP,anchor=east] (5) {5};
\node[left of=TCP,anchor=east] (4) {4};
\node[left of=IP,anchor=east] (3) {3};
\node[left of=MAC,anchor=east] (2) {2};
\node[left of=PHY,anchor=east] (1) {1};
\node[right of=HTTP,anchor=west] (5-expl) {Application layer};
\node[right of=TCP,anchor=west] (4-expl) {Transport layer};
\node[right of=IP,anchor=west] (3-expl) {Network layer};
\node[right of=MAC,anchor=west] (2-expl) {Data link layer};
\node[right of=PHY,anchor=west] (1-expl) {Physical layer};
\end{tikzpicture}
TODO: add HTTPS reference
*/}}

This is an illustration of the well known [protocol stack][protocol stack] which consists of 5 layers. Each of these layers is must be implemented to allow internet communications. HTTP(S) is the most visible aspect for the user, since it abstracts all underlaying layers. What is important is that HTTPS is actually HTTP _on top of_ TLS. TLS takes care of the security while HTTP takes care of things such as URLs, file transfers... You will probably have heard of layer 5 and layer 3 protocols. The others are just as important, but for our discussion here, we will only need to keep track of layers 3 through 5.

Something in this picture of off however, TLS is not included in any layer. This is, because TLS does not really fit into a specific layer in this model. It is situated between the 4th and 5th layer, since applications (such as HTTP) run on top of TLS, but TLS in turn runs op top of TCP. This is really important, since TLS is the only real addition that is added by the HTTPS protocol. If we would be using an HTTP connection, we only need to omit TLS from the picture above.

To make it all a bit less abstract and far-off, let's have a look at the following example: suppose you want to visit you favourite search engine: [DuckDuckGo][duck]. After a few milliseconds, the page is loaded and you are presented something that looks like this:

<figure class="centre-element">
![Axes example image](/images/latex/duckduckgo-homepage.png){:.max-400px-wide}
</figure>

Before your browser is able to display that page, a lot needs to happen.

## Where Does SSL Fit into the Picture?


## Interesting links

http://www.howtogeek.com/181767/htg-explains-what-is-https-and-why-should-i-care/
https://perezbox.com/2015/07/https-does-not-secure-your-website/


[google https]: https://webmasters.googleblog.com/2014/08/https-as-ranking-signal.html
[protocol stack]: https://en.wikipedia.org/wiki/Protocol_stack
[duck]: https://duckduckgo.com
