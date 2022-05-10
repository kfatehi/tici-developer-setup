diff --git a/tools/joystick/README.md b/tools/joystick/README.md
index 5a45785d..c74e5114 100644
--- a/tools/joystick/README.md
+++ b/tools/joystick/README.md
@@ -45,6 +45,17 @@ In order to use a joystick over the network, we need to run joystickd locally fr
    tools/joystick/joystickd.py
    ```
 
+### Web joystick on your mobile device
+
+A browser-based virtual joystick designed for touch screens. Starts automatically when installed on comma body (non-car robotics platform).
+For cars, start the web joystick service manually via SSH before starting the car.
+
+```shell
+tools/joystick/web.py
+```
+
+After starting the car/body, open the web joystick app at this URL: `http://[comma three IP address]:5000`
+
 ---
 Now start your car and openpilot should go into joystick mode with an alert on startup! The status of the axes will display on the alert, while button statuses print in the shell.
 
diff --git a/tools/joystick/web.py b/tools/joystick/web.py
index 353e0db1..5db48eea 100755
--- a/tools/joystick/web.py
+++ b/tools/joystick/web.py
@@ -18,70 +18,13 @@ index = """
 <script type="text/javascript">
 // Create JoyStick object into the DIV 'joyDiv'
 var joy = new JoyStick('joyDiv');
-function sendMoveCommand(x,y) {
+setInterval(function(){
+  var x = -joy.GetX()/100;
+  var y = joy.GetY()/100;
   let xhr = new XMLHttpRequest();
   xhr.open("GET", "/control/"+x+"/"+y);
   xhr.send();
-}
-function joyFunction(){
-  var x = -joy.GetX()/100;
-  var y = joy.GetY()/100;
-  sendMoveCommand(x,y);
-}
-var joyInterval = null;
-function startJoy() {
-    joyInterval = setInterval(joyFunction, 50);
-}
-function stopJoy() {
-    if (joyInterval) {
-        clearInterval(joyInterval);
-        joyInterval = null;
-    }
-}
-let lastKey = null;
-let lastValue = null;
-const accelerator = (k)=>{
-    if (lastKey != k) {
-        lastValue = 0.1;
-        lastKey = k;
-    }
-    return ()=>{
-        let a = lastValue*1.027;
-        let value = a < 0.89 ? a : lastValue;
-        lastValue = value;
-        return value;
-    }
-}
-function forward(a) {
-sendMoveCommand(0, a())
-}
-function left(a) {
-sendMoveCommand(a(), 0)
-}
-function right(a) {
-sendMoveCommand(-a(), 0)
-}
-function backward(a) {
-sendMoveCommand(0, -a())
-}
-function keyDownHandler() {
-    stopJoy();
-    if (!event) return;
-    let accel = accelerator(event.key);
-    if (event.key === 'w' || event.key === 'ArrowUp')
-        forward(accel);
-    else if (event.key === 's' || event.key === 'ArrowDown')
-        backward(accel);
-    else if (event.key === 'a' || event.key === 'ArrowLeft')
-        left(accel);
-    else if (event.key === 'd' || event.key === 'ArrowRight')
-        right(accel);
-    else
-        console.log('unhandled key:', event.key);
-    startJoy();
-}
-document.addEventListener('keydown', keyDownHandler, true);
-startJoy();
+}, 50);
 </script>
 """
 
