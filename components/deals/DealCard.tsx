import React from 'react';
import { Link } from 'react-router-dom';
import { Deal } from '../../types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

interface DealCardProps {
  deal: Deal;
}

export const DealCard: React.FC<DealCardProps> = ({ deal }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{deal.title}</CardTitle>
        <CardDescription>{deal.industry} - {deal.stage}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-3">{deal.summary}</p>
        <div className="mt-4 text-sm font-semibold">
          Funding: ${deal.amountMin.toLocaleString()} - ${deal.amountMax.toLocaleString()}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-500">
          <img src={deal.owner.avatarUrl} alt={deal.owner.fullName} className="w-6 h-6 rounded-full mr-2" />
          <span>{deal.owner.fullName}</span>
        </div>
        <Link to={`/deals/${deal.id}`}>
          <Button variant="outline" size="sm">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};