defmodule Nova.Typespecs do
  @typedoc """
  A 4 digit year, e.g. 1984
  """
  @type year :: integer
  
  # compound custom type
  @type error_map :: %{
    message: String.t,
    line_number: integer
  }
  
  @type number_with_remark :: {number, String.t}
  
  @doc """
  Parses a string.
  """
  @callback parse(String.t) :: {:ok, term} | {:error, String.t}
  
  @doc """
  Lists all supported file extensions.
  """
  @callback extensions() :: [String.t]

  @spec current_age(year) :: integer
  defp foo_bar(str), do: IO.puts(str)
  
  @spec add(number, number) :: {number, String.t}
  def add(x, y), do: {x + y, "You need a calculator to do that?!"}

  @spec multiply(number, number) :: {number, String.t}
  def multiply(x, y), do: {x * y, "Jeez, come on!"}
  
  @spec divide(number, number) :: number_with_remark
  def divide(x, y), do: {x * y, "Careful now."}
end
