import React, { useEffect, useState } from 'react';
import { User } from '@/api/entities';
import { LocationAlert } from '@/api/entities';
import { AlertTriangle, MapPin, Smartphone } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LocationMonitor({ user }) {
  const [locationStatus, setLocationStatus] = useState('checking');
  const [lastAlert, setLastAlert] = useState(null);

  useEffect(() => {
    if (!user || user.designation !== 'MDO') return;

    const checkLocationStatus = () => {
      if (!navigator.geolocation) {
        handleLocationIssue('location_unavailable', 'Geolocation not supported by device');
        return;
      }

      // Check if user has denied location permission
      navigator.permissions?.query({ name: 'geolocation' })
        .then(result => {
          if (result.state === 'denied') {
            handleLocationIssue('location_denied', 'Location permission denied by user');
          } else if (result.state === 'granted') {
            // Try to get current position
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setLocationStatus('active');
                // Clear any existing alerts if location is now working
                resolveLocationAlerts();
              },
              (error) => {
                let alertType = 'gps_disabled';
                let message = 'GPS disabled or unavailable';
                
                switch (error.code) {
                  case error.PERMISSION_DENIED:
                    alertType = 'location_denied';
                    message = 'Location access denied';
                    break;
                  case error.POSITION_UNAVAILABLE:
                    alertType = 'location_unavailable';
                    message = 'Location information unavailable';
                    break;
                  case error.TIMEOUT:
                    alertType = 'gps_disabled';
                    message = 'Location request timed out - GPS may be disabled';
                    break;
                }
                
                handleLocationIssue(alertType, message);
              },
              { timeout: 10000, maximumAge: 300000 }
            );
          } else {
            // Prompt state - request permission
            navigator.geolocation.getCurrentPosition(
              () => setLocationStatus('active'),
              (error) => handleLocationIssue('location_denied', 'Location permission required')
            );
          }
        })
        .catch(() => {
          // Fallback for older browsers
          navigator.geolocation.getCurrentPosition(
            () => setLocationStatus('active'),
            (error) => handleLocationIssue('location_denied', 'Location access required')
          );
        });
    };

    const handleLocationIssue = async (alertType, message) => {
      setLocationStatus('error');
      
      try {
        // Get device info
        const deviceInfo = `${navigator.userAgent} | ${navigator.platform}`;
        
        // Get manager info
        const allUsers = await User.list();
        const manager = allUsers.find(u => 
          u.designation === 'TSM' && u.territory === user.territory
        );
        
        if (!manager) return;

        // Check if similar alert already exists in last 24 hours
        const existingAlerts = await LocationAlert.filter({
          mdo_id: user.email,
          alert_type: alertType,
          status: 'active'
        });

        if (existingAlerts.length === 0) {
          const newAlert = await LocationAlert.create({
            mdo_id: user.email,
            manager_id: manager.email,
            alert_type: alertType,
            device_info: deviceInfo,
            duration_offline: 0
          });
          setLastAlert(newAlert);
        }
      } catch (error) {
        console.error('Error creating location alert:', error);
      }
    };

    const resolveLocationAlerts = async () => {
      try {
        const activeAlerts = await LocationAlert.filter({
          mdo_id: user.email,
          status: 'active'
        });

        for (const alert of activeAlerts) {
          await LocationAlert.update(alert.id, {
            status: 'resolved',
            resolved_date: new Date().toISOString()
          });
        }
        setLastAlert(null);
      } catch (error) {
        console.error('Error resolving location alerts:', error);
      }
    };

    // Initial check
    checkLocationStatus();

    // Periodic checks every 5 minutes
    const interval = setInterval(checkLocationStatus, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

  if (!user || user.designation !== 'MDO') return null;

  if (locationStatus === 'error') {
    return (
      <Alert className="mb-4 border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <div className="flex items-center justify-between">
            <div>
              <strong>Location Services Required</strong>
              <p className="text-sm mt-1">
                Please enable location services for field tracking compliance.
                Your manager has been notified.
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="ml-4 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (locationStatus === 'active') {
    return (
      <div className="mb-2 text-sm text-green-600 flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        Location tracking active
      </div>
    );
  }

  return null;
}