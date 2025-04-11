@extends('layouts.app')

@section('content')
<h2>Top 5 Highest Rated Lots</h2>
<table>
    <thead>
        <tr>
            <th>Lot ID</th>
            <th>Price</th>
            <th>Average Rating</th>
            <th>Total Reviews</th>
        </tr>
    </thead>
    <tbody>
        @foreach($topRated as $lot)
        <tr>
            <td>{{ $lot->lot_id }}</td>
            <td>{{ $lot->price }}</td>
            <td>{{ number_format($lot->avg_rating, 2) }}</td>
            <td>{{ $lot->total_reviews }}</td>
        </tr>
        @endforeach
    </tbody>
</table>
@endsection
