# Sakurity Racer

![](https://media.giphy.com/media/xT9IghAnWAtfSlg6re/giphy.gif)

This 128 LOC extension works pretty much as a "Make Money" button if used properly.

LEGAL: Use at your own risk and only with your own projects. Do not use it against anyone else.

1. Load this unpacked extension into your Chrome. We didn't upload it to the Chrome Store because for best results you need to run your own racer.js server anyway.

2. See the circle on the right? It's the sniffer button. Once you click it, for next 3 seconds all requests (except ignored once like OPTIONS) will be blocked and sent to specified default_server location where racer.js is running.

3. Racer.js will get exact same details you were about to make along with all credentials and cookies and will repeat it to the victim in parallel (5 by default). That can trigger a race condition. 

4. No luck? Do it a few times because most race conditions are hard to reproduce.

5. For most basic tests you can run racer.js on your localhost and that will be used by default. For real things run it on a server as close to the victim as possible and change default_server inside sniffer.js.

Best functionality to pentest: financial transfers, vouchers, discount codes, trade/withdraw functions and other actions that you're supposed to do limited amount of times. It doesn't cover all scenarios such as timed race conditions or when you need to run few different requests to achieve the result. 

But 99% of race attacks are just like that: click on the sniffer, perform an action on a website, PROFIT. You may end up with unlimited coffee for life.

You will be surprised how many developers don't know about locking and transactions. Be nice and tell them to use `SELECT FOR UPDATE`. Or `$redis.lock` if they are crazy enough to run a financial app on NoSQL.

Found a bug using this tool? Please add a link or GIF below!

1. Twitter likes https://twitter.com/homakov/status/910553628259348480



