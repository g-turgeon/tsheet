export default (event, callback) => {
  const callbackRef = useRef()

  callbackRef.current = callback

  useEffect(() => {
    console.log('Run')

    const handler = (event, data) => { callbackRef.current(data) }
    ipcRenderer.on(event, handler)
    return () => ipcRenderer.off(event, handler)
  }, [event])
}
