export async function saveFile() {
  const newHandle = await window.showSaveFilePicker();
  const writableStream = await newHandle.createWritable();
  writableStream.write("hello there\nwhat's up");
  await writableStream.close();

  const file = await newHandle.getFile();
  const stream = file.stream();
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    console.log(done);
    if (value) {
      console.log(value);
      console.log(decoder.decode(value));
    }
    if (done) {
      break;
    }
  }
}
