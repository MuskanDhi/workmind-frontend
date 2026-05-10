import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Users } from 'lucide-react';

const RecruiterEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data } = await api.get('/api/recruiter/employees');
        setEmployees(data.employees);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-navy">Employee Directory</h2>
      <p className="text-gray-500 text-sm">Note: Anonymous employees will have their names hidden.</p>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {employees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-4 w-16">#</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Surveys Answered</th>
                  <th className="px-6 py-4">Member Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {employees.map((emp, i) => {
                  const isAnonymous = emp.name === 'Anonymous Employee';
                  
                  return (
                    <tr key={emp.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-medium text-gray-400">{i + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className={`font-semibold ${isAnonymous ? 'text-gray-500 italic' : 'text-navy'}`}>
                            {emp.name}
                          </span>
                          {isAnonymous && <span className="bg-brandLight text-brand px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Anon</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">{emp.department || '-'}</td>
                      <td className="px-6 py-4 font-medium">{emp.surveysAnswered}</td>
                      <td className="px-6 py-4">{new Date(emp.memberSince).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon={Users} heading="No employees found" subtext="No employees have joined the company yet." />
        )}
      </div>
    </div>
  );
};

export default RecruiterEmployees;
