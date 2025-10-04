import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../../types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex-row items-start space-x-4 rtl:space-x-reverse">
        <img src={job.company.logoUrl} alt={`${job.company.name} logo`} className="w-12 h-12 rounded-lg border p-1"/>
        <div>
            <CardTitle className="text-lg">{job.title}</CardTitle>
            <CardDescription>
                <Link to={`/companies/${job.company.slug}`} className="hover:underline">{job.company.name}</Link>
            </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 rtl:space-x-reverse text-sm text-gray-600">
          <span>📍 {job.location}</span>
          <span>💼 {job.employmentType.replace('_', ' ')}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Link to={`/jobs/${job.id}`}>
          <Button variant="outline" size="sm">View Job</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};