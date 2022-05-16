const { spawn } = require('child_process');
const split2 = require('split2');
const rad2deg = r=>r*(180/Math.PI)
const proc = spawn('/data/media/developer/src/realsense_t265_stream/build/t265dump');
proc.on('exit', process.exit);

/*
this code is pretty terrible, i wonder if ill come back to this idea, if i do, a few things i want to see first:
1. worth looking this over https://github.com/commaai/openpilot/blob/master/common/transformations/README.md
2. i had some more thoughts in mind after writing it that i wanted to look at
 - https://forum.unity.com/threads/quaternion-to-remove-pitch.822768/
 - Then call Eigen angular distance vs desired orientation (also normalized to single dimension) to get radians, then make this value 0 via controller 
*/
proc.stdout.pipe(split2()).on('data', async (data)=>{
  let {roll, pitch} = JSON.parse(data);
  let r = Math.abs(Math.round(rad2deg(roll)))
  let n = pitch < 0 ? -1 : 1;
  let p = Math.abs(Math.round(rad2deg(pitch)))
  let x = (r > 160) ? p : 180-p;
  let o = (n === 1) ? x : 360-x;
  if (!busy) {
    busy = true;
    await handleOffset(o);
    console.log(o, Date.now());
  }
});
let busy=false;
const handleOffset = async (o)=>{
  if (o < 190) { // tuurn left
    await fetch('http://localhost:5000/control/-0.01/0');
  } else if (o > 170) { // turn right
    await fetch('http://localhost:5000/control/0.01/0');
  }
  busy = false;
}
