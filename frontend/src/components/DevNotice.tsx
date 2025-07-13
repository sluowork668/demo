import React from 'react';
import { Alert } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const DevNotice: React.FC = () => {
  return (
    <Alert
      message="Development Mode"
      description="This app is currently running with mock data. The backend server is not connected. All product data is simulated for demonstration purposes."
      type="info"
      showIcon
      icon={<InfoCircleOutlined />}
      style={{ 
        marginBottom: 16,
        borderRadius: 6
      }}
    />
  );
};

export default DevNotice; 