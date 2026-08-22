import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from '../components/ui/Toast';

describe('useToast and ToastProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ToastProvider>{children}</ToastProvider>
  );

  it('throws error when useToast is used outside of ToastProvider', () => {
    expect(() => renderHook(() => useToast())).toThrow(
      'useToast must be used within a ToastProvider'
    );
  });

  it('can add and show toast notifications', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showToast('Task Updated', 'success', 'Changes have been saved');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Task Updated');
    expect(result.current.toasts[0].type).toBe('success');
    expect(result.current.toasts[0].description).toBe('Changes have been saved');
  });

  it('can remove toast notification manually', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    let toastId = '';
    act(() => {
      toastId = result.current.addToast({
        title: 'Error Occurred',
        type: 'error',
      });
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.removeToast(toastId);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('automatically removes toast after 5 seconds timeout', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showToast('Auto Dismiss', 'info');
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('renders action button and triggers callback when clicked', async () => {
    const actionMock = vi.fn();

    const TestComponent = () => {
      const { addToast } = useToast();
      return (
        <div>
          <button
            onClick={() =>
              addToast({
                title: 'Undo Available',
                type: 'warning',
                action: { label: 'Undo Action', onClick: actionMock },
              })
            }
          >
            Trigger Action Toast
          </button>
        </div>
      );
    };

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const triggerBtn = screen.getByRole('button', { name: /Trigger Action Toast/i });
    await userEvent.click(triggerBtn);

    expect(screen.getByText('Undo Available')).toBeInTheDocument();
    const actionBtn = screen.getByRole('button', { name: /Undo Action/i });
    expect(actionBtn).toBeInTheDocument();

    await userEvent.click(actionBtn);
    expect(actionMock).toHaveBeenCalledTimes(1);
  });
});