import sys
import requests
import av
import io
import subprocess

SERVER_URL = "http://192.168.70.168:5000/tts"

def play_audio_stream(response):
    # Open the response as a container
    container = av.open(io.BytesIO(response.content), mode='r')

    # Get the audio stream
    audio_stream = container.streams.audio[0]

    # Create a subprocess with aplay
    aplay_process = subprocess.Popen(["aplay", "-t", "raw", "-f", "U8", "-r", str(audio_stream.rate), "-c", str(audio_stream.channels)], stdin=subprocess.PIPE)

    output_buffer = io.BytesIO()

    output_container = av.open(output_buffer, mode='w', format='wav')
    output_stream = output_container.add_stream("pcm_u8", rate=48000)


    # Read and decode audio frames
    for frame in container.decode(audio_stream):
        for packet in output_stream.encode(frame):
            output_container.mux(packet)
            data = output_buffer.getvalue()
            if data:
                aplay_process.stdin.write(data)
                output_buffer.seek(0)
                output_buffer.truncate()

    # Flush any remaining packets
    for packet in output_stream.encode(None):
        output_container.mux(packet)

    output_container.close()

    # Yield the remaining chunk
    data = output_buffer.getvalue()
    if data:
        aplay_process.stdin.write(data)
    
    aplay_process.stdin.close()
    aplay_process.wait()

def synthesize_text(text):
    payload = {
        "voice_name": "English-US.Female-1",
        "text": text
    }
    headers = {"Content-Type": "application/json"}
    response = requests.post(SERVER_URL, json=payload, headers=headers, stream=True)

    if response.status_code != 200:
        print(f"Request failed with status: {response.status_code}")
        sys.exit(1)

    # Stream and play the audio
    play_audio_stream(response)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <text-to-synthesize>")
        sys.exit(1)

    text = sys.argv[1]
    synthesize_text(text)
