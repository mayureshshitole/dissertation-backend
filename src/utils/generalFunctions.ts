const toUnixDateTime =  (datetime: any) => {
  const unixTimestamp = Math.floor(datetime.getTime() / 1000);
  return unixTimestamp;
};

export { toUnixDateTime };
