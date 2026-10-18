// Clean, dependency-free ZIP buffer creator for project deliverables
export interface ZipFileEntry {
  name: string;
  content: string | Buffer;
}

// Precomputed CRC-32 table
const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[i] = c >>> 0;
}

function calculateCrc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

export function createZipBuffer(files: ZipFileEntry[]): Buffer {
  const fileBuffers: Buffer[] = [];
  const centralDirectoryHeaders: Buffer[] = [];
  let currentOffset = 0;

  for (const file of files) {
    const fileData = typeof file.content === 'string' ? Buffer.from(file.content, 'utf8') : file.content;
    const nameBuffer = Buffer.from(file.name, 'utf8');
    const crc = calculateCrc32(fileData);
    const size = fileData.length;

    // 1. Local File Header (30 bytes + nameBuffer.length + fileData.length)
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0); // Local file header signature
    localHeader.writeUInt16LE(20, 4);         // Version needed (2.0)
    localHeader.writeUInt16LE(0, 6);          // General purpose bit flag
    localHeader.writeUInt16LE(0, 8);          // Compression method (0 = Stored / uncompressed)
    localHeader.writeUInt16LE(0x4000, 10);     // File last mod time
    localHeader.writeUInt16LE(0x5545, 12);     // File last mod date (2026)
    localHeader.writeUInt32LE(crc, 14);        // CRC-32
    localHeader.writeUInt32LE(size, 18);       // Compressed size
    localHeader.writeUInt32LE(size, 22);       // Uncompressed size
    localHeader.writeUInt16LE(nameBuffer.length, 26); // File name length
    localHeader.writeUInt16LE(0, 28);          // Extra field length

    fileBuffers.push(localHeader, nameBuffer, fileData);

    // 2. Central Directory Header (46 bytes + nameBuffer.length)
    const cdHeader = Buffer.alloc(46);
    cdHeader.writeUInt32LE(0x02014b50, 0);    // Central directory signature
    cdHeader.writeUInt16LE(20, 4);            // Version made by
    cdHeader.writeUInt16LE(20, 6);            // Version needed to extract
    cdHeader.writeUInt16LE(0, 8);             // General purpose bit flag
    cdHeader.writeUInt16LE(0, 10);            // Compression method
    cdHeader.writeUInt16LE(0x4000, 12);        // File last mod time
    cdHeader.writeUInt16LE(0x5545, 14);        // File last mod date
    cdHeader.writeUInt32LE(crc, 16);           // CRC-32
    cdHeader.writeUInt32LE(size, 20);          // Compressed size
    cdHeader.writeUInt32LE(size, 24);          // Uncompressed size
    cdHeader.writeUInt16LE(nameBuffer.length, 28); // File name length
    cdHeader.writeUInt16LE(0, 30);             // Extra field length
    cdHeader.writeUInt16LE(0, 32);             // File comment length
    cdHeader.writeUInt16LE(0, 34);             // Disk number start
    cdHeader.writeUInt16LE(0, 36);             // Internal file attributes
    cdHeader.writeUInt32LE(0x81a40000, 38);    // External file attributes (standard permissions)
    cdHeader.writeUInt32LE(currentOffset, 42); // Relative offset of local header

    centralDirectoryHeaders.push(cdHeader, nameBuffer);

    currentOffset += localHeader.length + nameBuffer.length + fileData.length;
  }

  const cdStart = currentOffset;
  let cdSize = 0;
  for (const h of centralDirectoryHeaders) {
    cdSize += h.length;
  }

  // 3. End of Central Directory Record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);                 // EOCD signature
  eocd.writeUInt16LE(0, 4);                          // Number of this disk
  eocd.writeUInt16LE(0, 6);                          // Disk where central directory starts
  eocd.writeUInt16LE(files.length, 8);               // Number of central directory records on this disk
  eocd.writeUInt16LE(files.length, 10);              // Total number of central directory records
  eocd.writeUInt32LE(cdSize, 12);                    // Size of central directory
  eocd.writeUInt32LE(cdStart, 16);                   // Offset of start of central directory
  eocd.writeUInt16LE(0, 20);                         // Comment length

  return Buffer.concat([...fileBuffers, ...centralDirectoryHeaders, eocd]);
}
