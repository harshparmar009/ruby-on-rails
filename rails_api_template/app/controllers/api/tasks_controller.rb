module Api
  class TasksController < ApplicationController
    before_action :set_task, only: %i[show update destroy]

    def index
      tasks = Task.order(created_at: :desc)

      render json: {
        success: true,
        data: tasks
      }
    end

    def show
      render json: {
        success: true,
        data: @task
      }
    end

    def create
      task = Task.new(task_params)

      if task.save
        render json: {
          success: true,
          message: "Task created successfully",
          data: task
        }, status: :created
      else
        render json: {
          success: false,
          errors: task.errors.full_messages
        }, status: :unprocessable_content
      end
    end

    def update
      if @task.update(task_params)
        render json: {
          success: true,
          message: "Task updated successfully",
          data: @task
        }
      else
        render json: {
          success: false,
          errors: @task.errors.full_messages
        }, status: :unprocessable_content
      end
    end

    def destroy
      @task.destroy!

      render json: {
        success: true,
        message: "Task deleted successfully"
      }
    end

    private

    def set_task
      @task = Task.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: {
        success: false,
        message: "Task not found"
      }, status: :not_found
    end

    def task_params
      params.require(:task).permit(
        :title,
        :description,
        :status,
        :priority,
        :completed
      )
    end
  end
end
