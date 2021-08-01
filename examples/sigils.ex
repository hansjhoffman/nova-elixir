defmodule Nova.Elixir.Sigils do
  @moduledoc """
    Sigils start with ~ and are followed by a letter:
  
    ~C Generates a character list with no escaping or interpolation
    ~c Generates a character list with escaping and interpolation
    ~R Generates a regular expression with no escaping or interpolation
    ~r Generates a regular expression with escaping and interpolation
    ~S Generates a string with no escaping or interpolation
    ~s Generates a string with escaping and interpolation
    ~W Generates a word list with no escaping or interpolation
    ~w Generates a word list with escaping and interpolation
    ~N Generates a NaiveDateTime struct
    ~T Generates a Time struct
    ~U Generates a DateTime struct (since Elixir 1.9.0)
    
    Sigils allow one of the following pairs:
      <...> A pair of pointy brackets
      {...} A pair of curly brackets
      [...] A pair of square brackets
      (...) A pair of parentheses
      |...| A pair of pipes
      /.../ A pair of forward slashes
      "..." A pair of double quotes
      '...' A pair of single quotes
    
    Possible regex modifiers (https://hexdocs.pm/elixir/1.12.2/Regex.html#module-modifiers):
      [unicode] (u) - enables Unicode specific patterns like \p and causes character classes like \w, \W, \s, etc. to also match on Unicode (see examples below in "Character classes"). It expects valid Unicode strings to be given on match
      [caseless] (i) - adds case insensitivity
      [dotall] (s) - causes dot to match newlines and also set newline to anycrlf; the new line setting can be overridden by setting (*CR) or (*LF) or (*CRLF) or (*ANY) according to :re documentation
      [multiline] (m) - causes ^ and $ to mark the beginning and end of each line; use \A and \z to match the end or beginning of the string
      [extended] (x) - whitespace characters are ignored except when escaped and allow # to delimit comments
      [firstline] (f) - forces the unanchored pattern to match before or at the first newline, though the matched text may continue over the newline
      [ungreedy] (U) - inverts the "greediness" of the regexp (the previous r option is deprecated in favor of U)
  """
  
  def foo() do
    # Char List
    char1 = ~c<2 + 7 = #{2 + 7}>
    char2 = ~c{2 + 7 = #{2 + 7}}
    char3 = ~C[2 + 7 = #{2 + 7}]
    char4 = ~c(2 + 7 = #{2 + 7})
    char5 = ~C|2 + 7 = #{if true do 1 else 0 end}|
    char6 = ~C/2 + 7 = #{2 + 7}/
    char7 = ~C"2 + 7 = #{2 + 7}"
    char8 = ~c'2 + 7 = #{2 + 7}'
    
    # Regex
    re1 = ~r<elixir>f
    re2 = ~R{elixir}iu
    re3 = ~r[elixir]U
    re4 = ~r(elixir)x
    re5 = ~R|elixir|im
    re6 = ~r/elixir/s
    re7 = ~r"elixir"u
    re8 = ~r'elixir'x
    assert ~r/(?<foo>.)(?<bar>.)/ == ~r/(?<foo>.)(?<bar>.)/
    assert ~r/(?<foo>.)(?<bar>.)/.source == ~r/(?<foo>.)(?<bar>.)/.source
    assert String.match?("123 456", ~r/^[[:alnum:][:blank:]]+$/)
    assert String.match?("123 456", ~r[^[[:alnum:][:blank:]]+$])
    
    # String
    str1 = ~S<the cat in the hat on the mat>
    str2 = ~s{the cat in the hat on the mat}
    str3 = ~S[the cat in the hat on the mat]
    str4 = ~S(String with escape codes \x26 #{"inter" <> :polation})
    str5 = ~s|the cat in the hat on the mat|
    str6 = ~s/the cat in the hat on the mat/
    str7 = ~s"the cat in the hat on the mat"
    str8 = ~S'the cat in the hat on the mat'
    
    # Word List
    word1 = ~W<i love #{'e'}lixir school>a
    word2 = ~w{i love #{'e'}lixir school}c
    word3 = ~w[i love #{'e'}lixir school]s
    word4 = ~w(i love #{'e'}lixir school)ac
    word5 = ~W|i love #{'e'}lixir school|as
    word6 = ~w/i love #{'e'}lixir school/acs
    word7 = ~w"i love #{'e'}lixir school"
    word8 = ~W'i love #{'e'}lixir school'
    
    # NaiveDateTime
    ndt1 = ~N<2015-01-23 23:50:07>
    ndt2 = ~N{2015-01-23 23:50:07}
    ndt3 = ~N[2015-01-23 23:50:07]
    ndt4 = ~N(2015-01-23 23:50:07)
    ndt5 = ~N|2015-01-23 23:50:07|
    ndt6 = ~N/2015-01-23 23:50:07/
    ndt7 = ~N"2015-01-23 23:50:07"
    ndt8 = ~N'2015-01-23 23:50:07'
    
    # DateTime
    dt1 = ~U<2015-01-23 23:50:07>
    dt2 = ~U{2015-01-23 23:50:07}
    dt3 = ~U[2015-01-23 23:50:07]
    dt4 = ~U(2015-01-23 23:50:07)
    dt5 = ~U|2015-01-23 23:50:07|
    dt6 = ~U/2015-01-23 23:50:07/
    dt7 = ~U"2015-01-23 23:50:07"
    dt8 = ~U'2015-01-23 23:50:07'
    
    # Time
    t1 = ~T<2015-01-23 23:50:07>
    t2 = ~T{2015-01-23 23:50:07}
    t3 = ~T[2015-01-23 23:50:07]
    t4 = ~T(2015-01-23 23:50:07)
    t5 = ~T|2015-01-23 23:50:07|
    t6 = ~T/2015-01-23 23:50:07/
    t7 = ~T"2015-01-23 23:50:07"
    t8 = ~T'2015-01-23 23:50:07'
    
    # Custom
    custom1 = ~x<elixir school>
    custom2 = ~Q{elixir school}
    custom3 = ~B[elixir school]
    custom4 = ~k(elixir school)
    custom5 = ~g|elixir school|
    custom6 = ~m/elixir school/
    custom7 = ~h"elixir school"
    custom8 = ~J'elixir school'
  end
end
