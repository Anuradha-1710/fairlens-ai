export const getScoreColor = (score) => {
  if (score >= 80) return '#10B981'; // Green
  if (score >= 60) return '#F59E0B'; // Amber
  if (score >= 40) return '#FF6B6B'; // Orange-Red
  return '#EF4444'; // Red
};

export const getSeverityColor = (severity) => {
  switch (severity) {
    case 'Low':
      return '#10B981';
    case 'Medium':
      return '#F59E0B';
    case 'High':
      return '#FF6B6B';
    case 'Critical':
      return '#EF4444';
    default:
      return '#6366F1';
  }
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

export const getSeverityLabel = (score) => {
  if (score >= 80) return 'Low';
  if (score >= 60) return 'Medium';
  if (score >= 40) return 'High';
  return 'Critical';
};
