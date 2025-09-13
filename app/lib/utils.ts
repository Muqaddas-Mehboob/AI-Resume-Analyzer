
// Logic for compressing the file format

export default function formatSize(bytes : number) : string{
    if(bytes == 0) return '0 bytes';

    const k = 1024;
    const size: string[] = ['Bytes',"KB", 'MB', 'GB', 'TB']

    const i : number = Math.floor(Math.log(bytes)/Math.log(k))

    return parseFloat((bytes/Math.pow(k,i)).toFixed(2)) + ' ' + size[i]
}