defmodule Nova.Heredocs do
  @moduledoc """
  This is a test.
  """
  
  @doc false
  defp foo_bar(), do: IO.puts("test")
  
  @doc """
  Gets a single link.

  Returns nil if the Link does not exist.

  ## Examples

      iex> get_link(123)
      %Link{}

      iex> get_link(456)
      nil

  """
  def get_link(id), do: Repo.get(Link, id)
  
  @doc ~S"""
  Converts double-quotes to single-quotes.
  
  ## Examples
  
      iex> convert("\"foo\"")
      "'foo'"
  
  """
  def convert(str) do
    str
    |> String.downcase
  end
end
