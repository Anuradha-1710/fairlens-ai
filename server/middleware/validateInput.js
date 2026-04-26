exports.validateAnalysisInput = (req, res, next) => {
  const { domain, dataset, datasetName } = req.body;

  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  if (!['hiring', 'loan', 'medical'].includes(domain)) {
    return res.status(400).json({ error: 'Invalid domain. Must be hiring, loan, or medical.' });
  }

  if (!dataset) {
    return res.status(400).json({ error: 'Dataset is required' });
  }

  if (!datasetName) {
    return res.status(400).json({ error: 'Dataset name is required' });
  }

  next();
};

exports.validateAuthInput = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  next();
};
