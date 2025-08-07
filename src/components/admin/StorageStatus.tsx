import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StorageManager, StorageStats } from '@/utils/storageManager';
import { AlertTriangle, HardDrive } from 'lucide-react';

interface StorageStatusProps {
  stats: StorageStats;
  onCleanup?: () => void;
}

const StorageStatus: React.FC<StorageStatusProps> = ({ stats, onCleanup }) => {
  const formatBytes = (bytes: number) => {
    const kb = bytes / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(1)}MB` : `${kb.toFixed(1)}KB`;
  };

  const getStatusColor = () => {
    if (stats.usagePercentage >= 90) return 'bg-red-500';
    if (stats.usagePercentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (stats.usagePercentage >= 90) return 'Critical';
    if (stats.usagePercentage >= 75) return 'Warning';
    return 'Good';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <HardDrive className="h-4 w-4" />
          Storage Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Used: {formatBytes(stats.used)}</span>
            <span className="font-medium">{stats.usagePercentage}%</span>
          </div>
          <Progress 
            value={stats.usagePercentage} 
            className="h-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Available: {formatBytes(stats.available)}</span>
            <span>Total: {formatBytes(stats.total)}</span>
          </div>
        </div>

        {stats.usagePercentage >= 75 && (
          <Alert variant={stats.usagePercentage >= 90 ? 'destructive' : 'default'}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {stats.usagePercentage >= 90 
                ? 'Storage critically full. Clean up images to avoid upload failures.'
                : 'Storage getting full. Consider cleaning up old images.'
              }
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
          <span className="text-xs font-medium">{getStatusText()}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StorageStatus;