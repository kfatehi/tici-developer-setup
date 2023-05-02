import sys
import requests
import av
import io
import subprocess
import itertools

SERVER_URL = "http://192.168.70.168:5000/tts"

def chunked_response_reader(response, chunk_size=8192):
    try:
        for chunk in response.iter_content(chunk_size):
            if chunk:
                yield chunk
    except requests.exceptions.ChunkedEncodingError:
        pass


def play_audio_stream(response):
    # Open the response as a container
    container = av.open(io.BytesIO(b''.join(chunked_response_reader(response))), mode='r')

    # Get the audio stream
    audio_stream = container.streams.audio[0]

    # Create a subprocess with aplay
    aplay_process = subprocess.Popen(["aplay", "-t", "raw", "-f", "U8", "-r", str(audio_stream.rate), "-c", str(audio_stream.channels)], stdin=subprocess.PIPE)

    output_buffer = io.BytesIO()

    output_container = av.open(output_buffer, mode='w', format='wav')
    output_stream = output_container.add_stream("pcm_u8", rate=48000)

    # Initialize a variable for the next timestamp
    next_dts = 0

    # Read and decode audio frames
    for frame in container.decode(audio_stream):
        frame.pts = next_dts
        for packet in output_stream.encode(frame):
            # Set the packet's timestamp
            packet.dts = packet.pts
            output_container.mux(packet)
            data = output_buffer.getvalue()
            if data:
                aplay_process.stdin.write(data)
                output_buffer.seek(0)
                output_buffer.truncate()

        # Update the next timestamp
        next_dts += frame.samples

    output_container.close()
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

def main():
    if len(sys.argv) == 2:
        text = sys.argv[1]
        synthesize_text(text)
    else:
        for line in sys.stdin:
            stripped_line = line.strip()
            if len(stripped_line) > 0:
                synthesize_text(stripped_line)

if __name__ == "__main__":
    main()
