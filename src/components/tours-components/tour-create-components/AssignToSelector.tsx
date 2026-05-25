"use client";

import React, { useState, useEffect, useRef } from "react";
import { User, ChevronDown, Check, Search, AlertCircle, Briefcase, Mail, Phone } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { EmployeeService } from "@/services/employeeService";
import { InputField } from "@/components/common-components/create-components/InputField";

interface Employee {
  employeeId: number;
  firstName: string;
  lastName: string;
  imageUrl: string;
  email: string;
  mobileNumber1: string;
  designationName: string;
  tours: {
    name: string | null;
    tour_id: number | null;
  }[];
}

interface AssignToSelectorProps {
  value?: number;
  onChange: (employeeId: number) => void;
  assignMessage: string;
  onAssignMessageChange: (message: string) => void;
  error?: string;
  required?: boolean;
}

export const AssignToSelector: React.FC<AssignToSelectorProps> = ({
  value,
  onChange,
  assignMessage,
  onAssignMessageChange,
  error,
  required = false,
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await EmployeeService.getEmployeesForTourAssignment();
        if (response.code === 200 && response.data) {
          setEmployees(response.data);
        } else {
          setEmployees([]);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const getFullName = (employee: Employee): string => {
    return `${employee.firstName} ${employee.lastName}`.trim();
  };

  const selectedEmployee = employees.find((e) => e.employeeId === value);

  const filteredEmployees = employees.filter((employee) => {
    const fullName = getFullName(employee);
    return (
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.designationName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getAssignedTourCount = (employee: Employee): number => {
    return employee.tours?.filter(tour => tour.tour_id !== null).length || 0;
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <label className="block text-sm font-medium mb-1.5" style={{ color: theme.textSecondary }}>
          Assign To
          {required && <span style={{ color: theme.error }}> *</span>}
        </label>

        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-left flex items-center justify-between transition-all duration-200"
          style={{
            backgroundColor: theme.background,
            borderColor: error ? theme.error : theme.border,
            color: theme.text,
          }}
        >
          <div className="flex items-center gap-2">
            {selectedEmployee?.imageUrl ? (
              <img
                src={selectedEmployee.imageUrl}
                alt={getFullName(selectedEmployee)}
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <User className="w-4 h-4" style={{ color: theme.textSecondary }} />
            )}
            <span className={!selectedEmployee ? "opacity-70" : ""}>
              {selectedEmployee
                ? getFullName(selectedEmployee)
                : "Select an employee..."}
            </span>
          </div>
          <ChevronDown
            className="w-4 h-4 transition-transform duration-200"
            style={{
              color: theme.textSecondary,
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>

        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-2 rounded-xl shadow-lg overflow-hidden"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
            }}
          >
            <div className="p-3 border-b" style={{ borderColor: theme.border }}>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: theme.textSecondary }}
                />
                <input
                  type="text"
                  placeholder="Search by name, email, or designation..."
                  value={searchQuery}
                  onChange={(e) => {
                    e.stopPropagation();
                    setSearchQuery(e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none"
                  style={{
                    backgroundColor: theme.background,
                    border: `1px solid ${theme.border}`,
                    color: theme.text,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = theme.primary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = theme.border;
                  }}
                />
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center" style={{ color: theme.textSecondary }}>
                  <div className="inline-block w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: theme.primary, borderTopColor: "transparent" }} />
                  <p className="mt-2">Loading employees...</p>
                </div>
              ) : filteredEmployees.length === 0 ? (
                <div className="p-4 text-center" style={{ color: theme.textSecondary }}>
                  {searchQuery ? "No employees match your search" : "No employees found"}
                </div>
              ) : (
                filteredEmployees.map((employee) => {
                  const fullName = getFullName(employee);
                  const assignedTourCount = getAssignedTourCount(employee);
                  const isSelected = value === employee.employeeId;
                  
                  return (
                    <button
                      key={employee.employeeId}
                      type="button"
                      onClick={() => {
                        onChange(employee.employeeId);
                        setIsOpen(false);
                        setSearchQuery("");
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-opacity-10 transition-colors"
                      style={{
                        backgroundColor: isSelected ? `${theme.primary}10` : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = `${theme.border}30`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {employee.imageUrl ? (
                            <img
                              src={employee.imageUrl}
                              alt={fullName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor: `${theme.primary}20`,
                                color: theme.primary,
                              }}
                            >
                              <User className="w-5 h-5" />
                            </div>
                          )}
                        </div>

                        {/* Employee details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium" style={{ color: theme.text }}>
                              {fullName}
                            </p>
                            {isSelected && (
                              <Check className="w-4 h-4 flex-shrink-0 ml-2" style={{ color: theme.primary }} />
                            )}
                          </div>
                          
                          {/* Designation */}
                          {employee.designationName && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <Briefcase className="w-3 h-3" style={{ color: theme.textSecondary }} />
                              <p className="text-xs" style={{ color: theme.textSecondary }}>
                                {employee.designationName}
                              </p>
                            </div>
                          )}
                          
                          {/* Email */}
                          {employee.email && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" style={{ color: theme.textSecondary }} />
                              <p className="text-xs" style={{ color: theme.textSecondary }}>
                                {employee.email}
                              </p>
                            </div>
                          )}
                          
                          {/* Phone */}
                          {employee.mobileNumber1 && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3" style={{ color: theme.textSecondary }} />
                              <p className="text-xs" style={{ color: theme.textSecondary }}>
                                {employee.mobileNumber1}
                              </p>
                            </div>
                          )}
                          
                          {/* Assigned tours count */}
                          {assignedTourCount > 0 && (
                            <p className="text-xs mt-1" style={{ color: theme.warning }}>
                              Currently assigned to {assignedTourCount} tour(s)
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {error && (
          <p className="mt-1.5 text-xs flex items-center gap-1" style={{ color: theme.error }}>
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}
      </div>

      <InputField
        label="Assign Message"
        name="assignMessage"
        value={assignMessage}
        onChange={(e) => onAssignMessageChange(e.target.value)}
        type="textarea"
        rows={2}
        placeholder="Add a message for the assignee..."
        helperText="Optional message for the assigned employee"
      />
    </div>
  );
};