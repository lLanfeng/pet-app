function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  if (err.code === 'SQLITE_CONSTRAINT') {
    return res.status(400).json({ error: '数据已存在' });
  }
  
  res.status(err.status || 500).json({
    error: err.message || '服务器内部错误'
  });
}

module.exports = {
  errorHandler
};
